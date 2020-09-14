const bcrypt = require("bcrypt");
const platform = require("platform");
const User = require("../models/User");
const Token = require("../models/Token");
const createToken = require("./createToken");
const cache = require("./cache");

/*
*
* Promise getToken(username, password)
*
* Summary:
*   The getToken function receives the user username/email and password
*   and returns a promise with the resulting tokens.
*
* Parameters:
*   String: username or email
*   String: password
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
*   This function receives user credentials and generates a new access
*   and refresh token that are resolved in a promise.
*   If not successfull an error is returned.
*   
*/

const getToken = (username, password, userAgent, redisClient) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      $or: [
        {username: username},
        {email: username}
      ]
    }).then((user) => {

      if(!user)
        return reject(new Error("USER_NOT_EXISTENT"));

      if(!user.email_confirmed) 
        return reject(new Error("EMAIL_NOT_CONFIRMED"));

      bcrypt.compare(password, user.password, async (err, compareSuccess) => { // compare the provided password with the user one
        
        if (err) return reject(new Error("AUTHENTICATION_ERROR"));

        if(!compareSuccess) return reject(new Error("WRONG_PASSWORD"));

        // get user platform
        const platformData = platform.parse(userAgent);

        // create tokens with specified duration and user id
        const refresh_token = createToken(user._id, "refresh");
        const access_token = createToken(user._id, "access");

        // save access token (is saved to Redis to better performance on authorization)
        try {
          await cache("access-tokens", access_token.value, JSON.stringify(user), process.env.ACCESS_TOKEN_DURATION * 60, true, false, redisClient);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_ACCESS_TOKEN"));
        }

        // create refresh token model
        const refresh = new Token({...refresh_token, userPlatform: JSON.stringify(platformData)});

        // save refresh token to MongoDB (refresh token needs persistence due to its long duration)
        try {
          await refresh.save()
          return resolve({ access_token, refresh_token });
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_REFRESH_TOKEN"));
        }
      });
    }).catch((error) => {
      console.log(error);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getToken;