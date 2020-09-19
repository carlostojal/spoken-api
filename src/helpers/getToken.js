const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");
const platform = require("platform");
const User = require("../models/User");
const Token = require("../models/Token");
const createToken = require("./createToken");
const cache = require("./cache");
const getLoginLocationSafety = require("./getLoginLocationSafety");

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

const getToken = (username, password, userPlatform, remoteAddress, userAgent, redisClient) => {
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

        // get user geolocation
        let geo = null;

        try {
          geo = geoip.lookup(remoteAddress);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_GETTING_LOGIN_LOCATION"));
        }


        // check login safety based on geolocation
        let safetyApproved = false;

        /*
        if(geo) {
          let locationSafety;
          try {
            locationSafety = await getLoginLocationSafety(geo.country, user);
          } catch(e) {
            console.error(e);
            return reject(new Error("ERROR_CHECKING_LOCATION_SAFETY"));
          }

          if(locationSafety >= process.env.MIN_LOGIN_LOCATION_SAFETY)
            safetyApproved = true;
        }*/

        // get user platform
        let platformData = null;

        if(userPlatform) {
          platformData = userPlatform;
        } else {
          try {
            platformData = platform.parse(userAgent);
            platformData = platformData.description;
          } catch(e) {
            console.error(e);
          }
        }

        // create tokens with specified duration and user id
        const refresh_token = createToken(user, "refresh");
        const access_token = createToken(user, "access");

        // save refresh token
        try {
          await cache(`session-uid-${user._id}-${refresh_token.value}`, null, JSON.stringify({createdAt: refresh_token.createdAt, expiresAt: refresh_token.expiresAt, userLocation: geo, userPlatform: platformData, approved: safetyApproved, approvalCode: Math.floor((Math.random() * 8999) + 1000)}), process.env.REFRESH_TOKEN_DURATION * 24 * 60 * 60, true, true, redisClient);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_REFRESH_TOKEN"));
        }

        return resolve({ access_token, refresh_token });
      });
    }).catch((error) => {
      console.log(error);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getToken;