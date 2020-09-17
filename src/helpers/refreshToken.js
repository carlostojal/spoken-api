const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const platform = require("platform");
const createToken = require("../helpers/createToken");
const cache = require("../helpers/cache");
const Token = require("../models/Token");

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

const refreshToken = (refresh_token, remoteAddress, userAgent, redisClient) => {
  return new Promise((resolve, reject) => {

    try {
      const query = Token.findOne({ value: refresh_token });
      query.exec(async (err, token) => {

        if(err) {
          console.error(err);
          return reject(new Error("ERROR_GETTING_TOKEN"));
        }
        
        if(!token)
          return reject(new AuthenticationError("INVALID_REFRESH_TOKEN"));
        
        let decoded = null;

        try {
          decoded = jwt.verify(refresh_token, process.env.TOKEN_SECRET);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_VERIFYING_TOKEN"));
        }

        if(!decoded)
          return reject(new Error("INVAlID_TOKEN"));

        await Token.populate(token, "user");
        
        const new_refresh_token = createToken(token.user._id, "refresh");
        const new_access_token = createToken(token.user._id, "access");

        // get user geolocation
        let geo = null;

        try {
          geo = geoip.lookup(remoteAddress);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_GETTING_LOGIN_LOCATION"));
        }

        // get user platform
        let platformData = null;

        try {
          platformData = platform.parse(userAgent);
        } catch(e) {
          console.error(e)
        }

        const newToken = new Token({...new_refresh_token, userLocation: JSON.stringify(geo), userPlatform: JSON.stringify(platformData)});

        // save new refresh token
        try {
          await newToken.save();
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_REFRESH_TOKEN"));
        }

        // delete old refresh token
        try {
          await Token.deleteOne({ value: refresh_token });
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_REMOVING_OLD_REFRESH_TOKEN"));
        }

        // save new access token
        try {
          await cache(`user-token-${new_access_token.value}`, null, JSON.stringify(token.user), process.env.ACCESS_TOKEN_DURATION * 60, true, true, redisClient);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_ACCESS_TOKEN"));
        }

        return resolve({ access_token: new_access_token, refresh_token: new_refresh_token});
      });
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_TOKEN_DATA"));
    }
  });
};

module.exports = refreshToken;