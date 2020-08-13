const bcrypt = require("bcrypt");
const User = require("../models/User");
const createToken = require("./createToken");

const getToken = (username, password, context) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      username: username,
    }).then((user) => {
      if(user) { // user exists

        if(user.email_confirmed) { // user confirmed the email, so can login

          bcrypt.compare(password, user.password, (err, compareSuccess) => {
            if (err) reject(err);

            if(compareSuccess) { // correct password
              // create tokens with specified duration and user id
              const refresh_token = createToken(user._id, "refresh");
              const access_token = createToken(user._id, "access");

              // remove expired refresh tokens
              for(let i = 0; i < user.refresh_tokens.length; i++) {
                if(user.refresh_tokens[i].expiry < Date.now()) {
                  user.refresh_tokens.splice(i, 1);
                  i--;
                }
              }

              // remove expired access tokens
              for(let i = 0; i < user.access_tokens.length; i++) {
                if(user.access_tokens[i].expiry < Date.now()) {
                  user.access_tokens.splice(i, 1);
                  i--;
                }
              }

              user.refresh_tokens.push(refresh_token);
              user.access_tokens.push(access_token);

              user.save().then((res) => {
                // send refresh token as httpOnly cookie
                context.res.cookie("refresh_token", refresh_token.value, {
                  expires: new Date(refresh_token.expiry),
                  httpOnly: true
                });
                console.log("User got tokens.");
                resolve(access_token.value); // send access token as query response
              }).catch((error) => {
                reject(error);
              });
            } else { // user exists but password is not correct
              reject(new Error("Wrong password."));
            }
          });
        } else {
          reject(new Error("Email not confirmed."));
        }
      } else {
        reject(new Error("User not existent."));
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = getToken;