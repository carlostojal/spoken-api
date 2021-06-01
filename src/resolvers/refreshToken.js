const jwt = require("jsonwebtoken");
const createToken = require("../helpers/session/createToken");
const Session = require("../db_models/Session");

const refreshToken = async (refresh_token, user_lat, user_long) => {

  // get user by decoding token
  let decoded = null;
  try {
    decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
  } catch(e) {
    console.error(e);
  }

  if(!decoded || !decoded.user)
    throw new Error("INVALID_TOKEN");

  const user = decoded.user;

  // get session data from token
  let session = null;
  try {
    session = await Session.findOne({token: refresh_token});
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_SESSION");
  }

  if(!session)
    throw new Error("INVALID_TOKEN");

  const new_refresh_token = createToken(user, "refresh");
  const new_access_token = createToken(user, "access");

  try {
    let user_location = null;
    if(user_lat && user_long) {
      user_location = {
        coordinates: [user_long, user_lat]
      };
    }
    session.token = new_refresh_token.value;
    session.expires_at = new_refresh_token.expires_at;
    session.last_refresh = Date.now();
    session.user_location = user_location;
    await session.save();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_UPDATING_SESSION");
  }

  // resolve with tokens
  return { access_token: new_access_token, refresh_token: new_refresh_token };
};

module.exports = refreshToken;
