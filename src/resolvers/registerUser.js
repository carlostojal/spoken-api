const bcrypt = require("bcrypt");
const insertUser = require("../helpers/controllers/users/insertUser");
const checkBirthdate = require("../helpers/checkBirthdate");
const generateId = require("../helpers/generateId");
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
*   After this the registered user object is returned.
*   
*/

const registerUser = (name, surname, birthdate, email, username, password, profile_type, profile_privacy_type, mysqlClient) => {
  return new Promise((resolve, reject) => {

    if(!checkBirthdate(birthdate))
      return reject(new Error("INVALID_BIRTHDATE"));

    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
      if (err) {
        console.error(err);
        return reject(new Error("ERROR_HASHING_PASSWORD"));
      }

      bcrypt.hash(password, salt, async (err, hash_password) => {

        if (err) {
          console.error(err);
          return reject(new Error("ERROR_HASHING_PASSWORD"));
        }

        const user = {
          id: generateId(),
          name,
          surname,
          birthdate: new Date(parseInt(birthdate)).getTime(),
          email,
          confirmation_code: Math.floor((Math.random() * 8999) + 1000),
          username: username.toLowerCase(),
          password: hash_password,
          profile_type,
          profile_privacy_type: profile_privacy_type == "business" ? "public" : profile_privacy_type // business profiles are always public
        };

        try {
          await insertUser(user, mysqlClient);
          success = true;
        } catch(e) {
          console.log(e);
          if(e.errno == 1062) { // duplicate key
            return reject(new Error("DUPLICATE_USERNAME_OR_EMAIL"));
          }
          return reject(new Error("ERROR_REGISTERING_USER"));
        }

        try {
          sendConfirmationEmail(user);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SENDING_CONFIRMATION_EMAIL"));
        }
        console.log("User registered.");
        
        return resolve(user);

      });
    });
  });
};

module.exports = registerUser;