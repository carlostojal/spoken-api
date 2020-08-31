const User = require("../models/User");
const { AuthenticationError } = require("apollo-server");
const createToken = require("../helpers/createToken");

/*
*
* Promise refreshToken(refresh_token)
*
* Summary:
*   The refreshToken function takes a refresh token and creates
*   a new access token and refresh token from it.
*
* Parameters:
*   String: refresh_token
*
* Return Value:
*   Promise: 
*     Object: tokens
*       Object: access_token
*         String: value
*         Number: expiry
*       Object: refresh_token
*         String: value
*         Number: expiry
*
* Description:
*   This function takes a refresh token and generates a new access 
*   token and refresh token if the given refresh token is valid.
*   
*/

const refreshToken = (refresh_token) => {
  return new Promise((resolve, reject) => {

    User.findOne({ "refresh_tokens.value":  refresh_token, "refresh_tokens.expiry": { $gt: Date.now() }}).then((user) => {

      if(!user)
        return reject(new AuthenticationError("INVALID_REFRESH_TOKEN"));
        
      const new_refresh_token = createToken(user._id, "refresh");

      const new_access_token = createToken(user._id, "access");

      // remove old refresh token
      user.refresh_tokens.filter((token) => token != refresh_token);

      // add new tokens
      user.refresh_tokens.push(new_refresh_token);
      user.access_tokens.push(new_access_token);

      user.save().then(() => {
        console.log("User refresh token.");
        return resolve({ access_token: new_access_token, refresh_token: new_refresh_token});
      }).catch((error) => {
        console.log(error);
        return reject(new Error("ERROR_UPDATING_USER"));
      });

    }).catch((error) => {
      console.log(error);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
};

module.exports = refreshToken;