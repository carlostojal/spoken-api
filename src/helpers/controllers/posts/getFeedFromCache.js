
const getFeedFromCache = (page, user_id) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.LRANGE(`feed:${user_id}:${page}`, 0, -1, (err, result) => {

      if(err)
        return reject(err);

      return resolve(result);
    });
  });
};

module.exports = getFeedFromCache;