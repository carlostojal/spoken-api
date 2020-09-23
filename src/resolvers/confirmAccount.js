const User = require("../models/User");

const confirmAccount = (user_id, code) => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await User.findById(user_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FINDING_USER"));
    }

    if(!user)
      return reject(new Error("USER_NOT_FOUND"));

    if(!user.email_confirmed) {
      if(user.confirmation_code == code) {
        user.email_confirmed = true;
        try {
          await user.save();
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_UPDATING_USER"));
        }
      } else {
        return reject(new Error("WRONG_CONFIRMATION_CODE"));
      }
    }

    return resolve(user);
  });
};

module.exports = confirmAccount;