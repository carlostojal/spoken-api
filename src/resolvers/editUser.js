const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const editUser = (name, surname, email, username, password, profile_pic, profile_privacy_type, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {

      if (err)
        return reject(new Error("ERROR_HASHING_PASSWORD"));

      bcrypt.hash(password, salt, async (err, hash_password) => {

        if (err)
          return reject(new Error("ERROR_HASHING_PASSWORD"));

        let cur_user;
        try {
          cur_user = await User.findById(user._id);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_GETTING_USER"));
        }

        if(cur_user.email != email && process.env.ENABLE_EMAIL_CONFIRMATION == "true") {
          cur_user.email_confirmed = false;
          cur_user.confirmation_code = Math.floor(Math.random() * 1000) // generate random confirmation code in range 0-999
        }

        cur_user.name = name;
        cur_user.surname = surname;
        cur_user.email = email;
        cur_user.username = username;
        cur_user.password = hash_password;
        cur_user.profile_pic = profile_pic;
        cur_user.profile_privacy_type = profile_privacy_type;

        try {
          await cur_user.save();
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_USER"));
        }

        return resolve(cur_user);
        
      });
    });
  });
};

module.exports = editUser;