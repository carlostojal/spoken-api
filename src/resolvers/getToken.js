const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");
const platform = require("platform");
const createToken = require("../helpers/session/createToken");
const getUserByUsernameOrEmail = require("../helpers/controllers/users/getUserByUsernameOrEmail");
const saveTokenToCache = require("../helpers/controllers/sessions/saveTokenToCache");
const setPushToken = require("../helpers/controllers/users/setPushToken");
const saveSession = require("../helpers/controllers/sessions/saveSession");

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

const getToken = (username, password, userPlatform, remoteAddress, userAgent, pushToken, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    let user; 

    try {
      user = await getUserByUsernameOrEmail(username, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user)
      return reject(new Error("USER_NOT_FOUND"));

    bcrypt.compare(password, user.password, async (err, compareSuccess) => { // compare the provided password with the user one
    
      if (err)
        return reject(new Error("AUTHENTICATION_ERROR"));

      if(!compareSuccess) return reject(new Error("WRONG_PASSWORD"));

      if(!user.email_confirmed) 
        return reject(new Error("EMAIL_NOT_CONFIRMED"));

      /*
      // get user geolocation
      let geo = null;
      try {
        geo = geoip.lookup(remoteAddress);
      } catch(e) {
        
        return reject(new Error("ERROR_GETTING_LOGIN_LOCATION"));
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

      const session = {user_id: user.id, token: refresh_token.value, expires_at: new Date(refresh_token.expires_at), user_platform: platformData};

      // saveTokenToCache(user.id, refresh_token.value, session);

      try {
        await saveSession(session, mysqlPool);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CREATING_SESSION"));
      }

      try {
        await setPushToken(user.id, pushToken, mysqlPool)
      } catch(e) {
        console.error(e);
      }

      return resolve({ access_token, refresh_token });
    });
  });
}

module.exports = getToken;
