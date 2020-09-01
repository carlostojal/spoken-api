const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server");
const sendConfirmationEmail = require("./sendConfirmationEmail");

/*
*
* Promise editUser(name, surname, email, username,
* password, profile_pic_media_id, profile_privacy_type)
*
* Summary:
*   The editUser function takes user data and edits the 
*   session user.
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
*   checks for duplicated key values and if the email was update
*   sends a confirmation email.
*   After this the updated user object is returned.
*   
*/

const editUser = (name, surname, email, username, password, profile_pic_media_id, profile_type, profile_privacy_type, user) => {
  return new Promise((resolve, reject) => {

    if(user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {

      if (err) {
        console.error(err);
        return reject(new Error("ERROR_HASHING_PASSWORD"));
      }

      bcrypt.hash(password, salt, (err, hash_password) => {

        if (err) {
          console.error(err);
          return reject(new Error("ERROR_HASHING_PASSWORD"));
        }
          
        // update profile with the provided data
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.username = username;
        user.password = hash_password;
        user.profile_pic_media_id = profile_pic_media_id;
        user.profile_type = profile_type;
        user.profile_privacy_type = profile_privacy_type;

        if(user.email != email) { // the email was updated
          user.email_confirmed = false;
          user.confirmation_code = Math.floor(Math.random() * 1000) // generate random confirmation code in range 0-999
        }

        // save to database
        user.save().then(async (result) => {
          if(!result.email_confirmed) { // should send confirmation email
            try {
              await sendConfirmationEmail(user);
            } catch(err) {
              console.error(err);
              return reject(new Error("ERROR_SENDING_CONFIRMATION_EMAIL"));
            }
          }
          console.log(`User ${user.username} updated data.`);
          return resolve(result);
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

module.exports = editUser;