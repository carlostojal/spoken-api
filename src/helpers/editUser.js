const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");

const editUser = (name, surname, email, username, password, profile_pic_media_id, profile_privacy_type, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      return reject(new AuthenticationError("Bad authentication."));

    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {

      if (err) return reject(err);

      bcrypt.hash(password, salt, (err, hash_password) => {
        if (err) reject(err);

        User.findById(context.user._id).then((user) => {
          
          user.name = name;
          user.surname = surname;
          user.email = email;
          user.username = username;
          user.password = hash_password;
          user.profile_pic_media_id = profile_pic_media_id;
          user.profile_privacy_type = profile_privacy_type;

          user.save().then((result) => {
            console.log("User updated.");
            return resolve(result);
          }).catch((err) => {
            return reject(err);
          });
        }).catch((error) => {
          return reject(error);
        })

      });
    });
  });
};

module.exports = editUser;