const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const platform = require("platform");
const createToken = require("../helpers/createToken");
const getFromCache = require("../helpers/getFromCache");
const cache = require("../helpers/cache");
const deleteFromCache = require("../helpers/deleteFromCache");
const getUserByToken = require("../helpers/getUserByToken");

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

const refreshToken = (refresh_token, redisClient) => {
  return new Promise(async (resolve, reject) => {

    // get user by decoding token
    let user = null;
    try {
      user = await getUserByToken(refresh_token, redisClient);
    } catch(e) {
      console.error(e);
    }

    if(!user)
      return reject(new Error("INVALID_TOKEN"));

    // get session data from token
    let session = null;
    try {
      session = await getFromCache(`session-uid-${user._id}-${refresh_token}`, null, redisClient);
      session = JSON.parse(session);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSION"));
    }

    if(!session)
      return reject(new Error("INVALID_TOKEN"));

    session.expiresAt = Date.now() + process.env.REFRESH_TOKEN_DURATION * 24 * 60 * 60;

    // delete old session
    try {
      await deleteFromCache(`session-uid-${user._id}-${refresh_token}`, null, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_DELETING_OLD_SESSION"));
    }

    const new_refresh_token = createToken(user, "refresh");
    const new_access_token = createToken(user, "access");

    // create new session
    try {
      await cache(`session-uid-${user._id}-${new_refresh_token.value}`, null, JSON.stringify(session), process.env.REFRESH_TOKEN_DURATION * 24 * 60 * 60, true, true, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_SAVING_SESSION"));
    }

    // resolve with tokens
    return resolve({ access_token: new_access_token, refresh_token: new_refresh_token });
  });
};

module.exports = refreshToken;