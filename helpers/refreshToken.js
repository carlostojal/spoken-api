const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const createToken = require("../helpers/createToken");

const refreshToken = (refresh_token, res) => {
  return new Promise((resolve, reject) => {
    User.findOne({ "refresh_tokens.value":  refresh_token, "refresh_tokens.expiry": { $gt: Date.now() }}).then((user) => {

      if(!user)
        return reject(new AuthenticationError("Invalid refresh token"));
      
      const new_refresh_token = createToken(user._id, "refresh");

      const new_access_token = createToken(user._id, "access");
      
      // remove old refresh token
      for(let i = 0; i < user.refresh_tokens.length; i++) {
        if(user.refresh_tokens[i].value == refresh_token) {
          user.refresh_tokens.splice(i, 1);
          i--;
          break;
        }
      }

      // add new tokens
      user.refresh_tokens.push(new_refresh_token);
      user.access_tokens.push(new_access_token);

      user.save().then(() => {
        // set refresh token cookie in response
        res.cookie("refresh_token", new_refresh_token.value, {
          expires: new Date(refresh_token.expiry),
          httpOnly: true
        });
        console.log("User refresh token.");
        return resolve(new_access_token.value);
      }).catch((error) => {
        return reject(error);
      });

    }).catch((error) => {
      return reject(error);
    });
  });
};

module.exports = refreshToken;