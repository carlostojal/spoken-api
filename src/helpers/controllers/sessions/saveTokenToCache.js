
const saveTokenToCache = (user_id, refresh_token, session) => {
  return new Promise(async (resolve, reject) => {

    // connect redis and get client object
    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    // save to redis
    redisClient.set(`session:${user_id}:${refresh_token}`, JSON.stringify(session), "EX", process.env.REFRESH_TOKEN_DURATION * 86400, (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    });
  });
};

module.exports = saveTokenToCache;