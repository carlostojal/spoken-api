const User = require("../models/User")

const logout = (refresh_token, access_token, res) => {
  return new Promise((resolve, reject) => {
    User.findOne({ "refresh_tokens.value": refresh_token }).then((user) => {

      // remove refresh token
      for(let i = 0; i < user.refresh_tokens.length; i++) {
        if(user.refresh_tokens[i].value == refresh_token) {
          user.refresh_tokens.splice(i, 1);
          i--;
          break;
        }
      }

      // remove access token
      for(let i = 0; i < user.access_tokens.length; i++) {
        if(user.access_tokens[i].value == access_token) {
          user.refresh_tokens.splice(i, 1);
          i--;
          break;
        }
      }

      user.save().then((user) => {
        // clean refresh token from cookies
        res.cookie("refresh_token", null);
        return resolve(user);
      }).catch((error) => {
        return reject(error);
      })
    }).catch((error) => {
      return reject(error);
    });
  });
};

module.exports = logout;