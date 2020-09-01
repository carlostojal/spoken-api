const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendConfirmationEmail = require("./sendConfirmationEmail");

/*
*
* Promise registerUser(name, surname, birthdate, email, username
* password, profile_type, profile_privacy_type)
*
* Summary:
*   The registerUser function takes user data and registers the
*   user.
*
* Parameters:
*   String: name
*   String: surname
*   String: birthdate
*   String: email
*   String: username
*   String: password
*   String: profile_type
*   String: profile_privacy_type
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   This function takes user data, encrypts the provided password,
*   checks for duplicated key values and then sends a confirmation 
*   email.
*   After this the registered user array is returned.
*   
*/

const registerUser = (name, surname, birthdate, email, username, password, profile_type, profile_privacy_type) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
      if (err) console.error(err), reject(new Error("ERROR_HASHING_PASSWORD"));

      bcrypt.hash(password, salt, (err, hash_password) => {
        if (err) console.error(err), reject(new Error("ERROR_HASHING_PASSWORD"));

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
          confirmation_code: Math.floor(Math.random() * 1000), // generate random confirmation code in range 0-999
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
            console.error(err);
            reject(new Error("ERROR_SENDING_CONFIRMATION_EMAIL"));
          });
        }).catch((err) => {
          console.error(err);
          let error;
          if(err.code == 11000) { // duplicate key error
            if(err.keyValue.username) // duplicate username
              error = new Error("USERNAME_ALREADY_TAKEN");
            else if(err.keyValue.email) // duplicate email
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