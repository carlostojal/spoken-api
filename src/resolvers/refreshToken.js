const jwt = require("jsonwebtoken");
const createToken = require("../helpers/session/createToken");
const getFromCache = require("../helpers/cache/getFromCache");
const cache = require("../helpers/cache/cache");
const deleteFromCache = require("../helpers/cache/deleteFromCache");
const saveTokenToCache = require("../helpers/controllers/sessions/saveTokenToCache");

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
  return new Promise(async (resolve, reject) => {

    // get user by decoding token
    let decoded = null;
    try {
      decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch(e) {

    }

    if(!decoded || !decoded.user)
      return reject(new Error("INVALID_TOKEN"));

    const user = decoded.user;

    // get session data from token
    let session = null;
    try {
      session = await getFromCache(`session:${user.id}:${refresh_token}`, null);
      session = JSON.parse(session);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_SESSION"));
    }

    if(!session)
      return reject(new Error("INVALID_TOKEN"));

    // delete old session
    try {
      await deleteFromCache(`session:${user.id}:${refresh_token}`, null);
    } catch(e) {
      return reject(new Error("ERROR_DELETING_OLD_SESSION"));
    }

    const new_refresh_token = createToken(user, "refresh");
    const new_access_token = createToken(user, "access");

    session.expiresAt = new_refresh_token.expiresAt * 1000;

    // create new session
    try {
      await saveTokenToCache(user.id, new_refresh_token.value, session);
    } catch(e) {
      return reject(new Error("ERROR_SAVING_SESSION"));
    }

    // resolve with tokens
    return resolve({ access_token: new_access_token, refresh_token: new_refresh_token });
  });
};

module.exports = refreshToken;
