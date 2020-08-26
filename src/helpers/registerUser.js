const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendConfirmationEmail = require("./sendConfirmationEmail");

const registerUser = (name, surname, birthdate, email, username, password, profile_type, profile_privacy_type) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (err, hash_password) => {
        if (err) reject(err);

        const user = new User({
          access_token: {
            value: null,
            expiry: null
          },
          refresh_token: {
            value: null,
            expiry: null
          },
          name: name,
          surname: surname,
          birthdate: new Date(parseInt(birthdate)).getTime().toString(),
          email: email,
          email_confirmed: false,
          confirmation_code: Math.floor(Math.random() * 1000),
          username: username.toLowerCase(),
          password: hash_password,
          profile_pic_media_id: null,
          profile_type: profile_type,
          profile_privacy_type: profile_privacy_type,
          posts: [],
          following:  [],
          followers: []
        });

        user.save().then((result) => {
          // saved user, now send confirmation email
          sendConfirmationEmail(user).then(() => {
            console.log("User registered.");
            resolve(result);
          }).catch((err) => {
            console.log(err);
            reject(new Error("ERROR_SENDING_CONFIRMATION_EMAIL"));
          });
        }).catch((err) => {
          let error;
          if(err.code == 11000) { // duplicate key error
            if(err.keyValue.username) // duplicate username
              error = new Error("USERNAME_ALREADY_TAKEN");
            else if(err.keyValue.email)
              error = new Error("EMAIL_ALREADY_TAKEN");
          } else {
            error = new Error("ERROR_SAVING_USER");
          }
          reject(error);
        });

      });
    });
  });
};

module.exports = registerUser;