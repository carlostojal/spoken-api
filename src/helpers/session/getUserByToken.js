const jwt = require("jsonwebtoken");
const User = require("../../db_models/User");

const getUserByToken = async (token) => {

  // verify and decode user token
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch(e) {
    throw new Error("ERROR_VERIFYING_TOKEN");
  }

  // token is not valid, so the decoded data is null
  if(!decoded)
    throw new Error("INVALID_TOKEN");

  // get user from cache
  let user;
  /*
  try {
    user = await getFromCache(`userdata-uid-${decoded.user.id}`, null, redisClient);
    user = JSON.parse(user);
  } catch(e) {
    throw new Error("ERROR_GETTING_USER");
  }

  if(user)
    return resolve(user);*/
  
  // the user was not in cache, so get from database
  try {
    user = await User.findById(decoded.user._id);
  } catch(e) {
    throw new Error("ERROR_GETTING_USER");
  }

  /*
  // save the user in cache
  try {
    await cache(`userdata-uid-${user.id}`, null, JSON.stringify(user), process.env.USER_DATA_CACHE_DURATION, false, false, redisClient);
  } catch(e) {
    
  }*/

  return user;
}

module.exports = getUserByToken;
