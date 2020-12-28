const jwt = require("jsonwebtoken");
const getUserById = require("../controllers/users/getUserById");
const getFromCache = require("../cache/getFromCache");
const cache = require("../cache/cache");

const getUserByToken = (token) => {
  return new Promise(async (resolve, reject) => {

    console.log(token);

    let mysqlClient;
    try {
      mysqlClient = await require("../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    let redisClient;
    try {
      redisClient = await require("../../config/redis");
    } catch(e) {
      return reject(e);
    }

    // verify and decode user token
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch(e) {

    }

    // token is not valid, so the decoded data is null
    if(!decoded)
      return reject(new Error("INVALID_TOKEN"));

    // get user from cache
    let user;
    /*
    try {
      user = await getFromCache(`userdata-uid-${decoded.user.id}`, null, redisClient);
      user = JSON.parse(user);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(user)
      return resolve(user);*/
    
    // the user was not in cache, so get from database
    try {
      user = await getUserById(decoded.user.id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_USER"));
    }

    /*
    // save the user in cache
    try {
      await cache(`userdata-uid-${user.id}`, null, JSON.stringify(user), process.env.USER_DATA_CACHE_DURATION, false, false, redisClient);
    } catch(e) {
      
    }*/

    console.log(user);

    return resolve(user);
  });
}

module.exports = getUserByToken;
