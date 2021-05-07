const jwt = require("jsonwebtoken");
const createToken = require("../helpers/session/createToken");
const Session = require("../db_models/Session");

const refreshToken = (refresh_token) => {
  return new Promise(async (resolve, reject) => {

    // get user by decoding token
    let decoded = null;
    try {
      decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch(e) {
      console.error(e);
    }

    if(!decoded || !decoded.user)
      return reject(new Error("INVALID_TOKEN"));

    const user = decoded.user;

    // get session data from token
    let session = null;
    try {
      session = await Session.findOne({refresh_token});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSION"));
    }

    if(!session)
      return reject(new Error("INVALID_TOKEN"));

    const new_refresh_token = createToken(user, "refresh");
    const new_access_token = createToken(user, "access");

    try {
      session.refresh_token = new_refresh_token.value;
      session.expires_at = new_refresh_token.expires_at;
      await session.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_UPDATING_SESSION"));
    }

    // resolve with tokens
    return resolve({ access_token: new_access_token, refresh_token: new_refresh_token });
  });
};

module.exports = refreshToken;
