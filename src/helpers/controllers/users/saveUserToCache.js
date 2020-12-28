
const saveUserToCache = (user) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.set(`user:${user.id}`, JSON.stringify(user), "EX", process.env.USER_DATA_CACHE_DURATION, (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    });
  });
};

module.exports = saveUserToCache;