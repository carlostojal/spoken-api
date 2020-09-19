const jwt = require("jsonwebtoken");
const User = require("../models/User");
const getFromCache = require("./getFromCache");
const cache = require("./cache");

const getUserByToken = (token, redisClient) => {
  return new Promise(async (resolve, reject) => {

    // verify and decode user token
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(e) {
      console.error(e);
    }

    // token is not valid, so the decoded data is null
    if(!decoded)
      return reject(new Error("INVALID_TOKEN"));

    // get user from cache
    let user;
    try {
      user = await getFromCache(`userdata-uid-${decoded.user._id}`, null, redisClient);
      user = JSON.parse(user);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(user)
      return resolve(user);
    
    // the user was not in cache, so get from database
    try {
      user = await User.findById(decoded.user._id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    // save the user in cache
    try {
      await cache(`userdata-uid-${decoded.user._id}`, null, JSON.stringify(user), process.env.USER_DATA_CACHE_DURATION, true, true, redisClient);
    } catch(e) {
      console.error(e);
    }

    return resolve(user);
  });
}

module.exports = getUserByToken;
