const User = require("../db_models/User");

const confirmAccount = async (username, code) => {

  let user = null;
  try {
    user = User.findOne({$or: [
      {username: username},
      {email: username}
    ]});
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  if(!user)
    throw new Error("USER_NOT_FOUND");

  if(user.email_confirmed)
    throw new Error("EMAIL_ALREADY_CONFIRMED");

  if(user.confirmation_code != code)
    throw new Error("WRONG_CONFIRMATION_CODE");


  try {
    user.email_confirmed = true;
    await user.save();
  } catch(e) {
    console.error(e);
    throw e;
  }
    
  return user;
};

module.exports = confirmAccount;