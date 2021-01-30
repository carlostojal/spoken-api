const jwt = require("jsonwebtoken");
const createToken = require("../helpers/session/createToken");
const deleteFromCache = require("../helpers/cache/deleteFromCache");
const getSessionByToken = require("../helpers/controllers/sessions/getSessionByToken");
const updateSessionToken = require("../helpers/controllers/sessions/updateSessionToken");

const refreshToken = (refresh_token, mysqlPool) => {
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
      session = await getSessionByToken(refresh_token, mysqlPool);
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

    try {
      await updateSessionToken(refresh_token, new_refresh_token, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_UPDATING_SESSION"));
    }

    // resolve with tokens
    return resolve({ access_token: new_access_token, refresh_token: new_refresh_token });
  });
};

module.exports = refreshToken;
