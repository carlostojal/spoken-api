const User = require("../db_models/User");

const confirmAccount = (username, code) => {
  return new Promise(async (resolve, reject) => {

    let user = null;
    try {
      user = User.findOne({$or: [
        {username: username},
        {email: username}
      ]});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user)
      return reject(new Error("USER_NOT_FOUND"));

    if(user.email_confirmed)
      return reject(new Error("EMAIL_ALREADY_CONFIRMED"));

    if(user.confirmation_code != code)
      return reject(new Error("WRONG_CONFIRMATION_CODE"));


    try {
      user.email_confirmed = true;
      await user.save();
    } catch(e) {
      console.error(e);
      return reject(e);
    }
      
    return resolve(user);

  });
};

module.exports = confirmAccount;