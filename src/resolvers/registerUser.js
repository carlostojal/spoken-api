const bcrypt = require("bcrypt");
const insertUser = require("../helpers/controllers/users/insertUser");
const insertRelation = require("../helpers/controllers/relations/insertRelation");
const checkBirthdate = require("../helpers/checkBirthdate");
const sendConfirmationEmail = require("./sendConfirmationEmail");
const checkPasswordStrength = require("check-password-strength");

const registerUser = (name, surname, birthdate, email, username, password, profile_type, profile_privacy_type) => {
  return new Promise((resolve, reject) => {

    // convert email and username to lower case
    email = email.toLowerCase();
    username = username.toLowerCase();

    // remove spaces from beggining and ending of string
    name = name.trim();
    surname = surname.trim();
    email = email.trim();
    username = username.trim();
    password = password.trim();

    if(!checkBirthdate(birthdate))
      return reject(new Error("INVALID_BIRTHDATE"));

    if(!name.match(process.env.NAME_REGEX) || !surname.match(process.env.NAME_REGEX))
      return reject(new Error("INVALID_NAME_OR_SURNAME"));

    if(!email.match(process.env.EMAIL_REGEX))
      return reject(new Error("INVALID_EMAIL"));
    
    if(!username.match(process.env.USERNAME_REGEX))
      return reject(new Error("INVALID_USERNAME"));

    const passwordStrength = checkPasswordStrength(password).id;

    if(passwordStrength == 0)
      return reject(new Error("WEAK_PASSWORD"));

    bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS), (err, salt) => {
      if (err) {
        
        return reject(new Error("ERROR_HASHING_PASSWORD"));
      }

      bcrypt.hash(password, salt, async (err, hash_password) => {

        if (err) {
          
          return reject(new Error("ERROR_HASHING_PASSWORD"));
        }

        const user = {
          name,
          surname,
          birthdate: new Date(parseInt(birthdate)),
          email,
          confirmation_code: Math.floor((Math.random() * 8999) + 1000),
          username: username.toLowerCase(),
          password: hash_password,
          profile_type,
          profile_privacy_type: profile_privacy_type == "business" ? "public" : profile_privacy_type // business profiles are always public
        };

        try {
          await insertUser(user);
          success = true;
        } catch(e) {
          if(e.errno == 1062) { // duplicate key
            return reject(new Error("DUPLICATE_USERNAME_OR_EMAIL"));
          }
          return reject(new Error("ERROR_REGISTERING_USER"));
        }

        try {
          sendConfirmationEmail(user.username, password);
        } catch(e) {
          
        }
        
        return resolve(user);

      });
    });
  });
};

module.exports = registerUser;