
const saveFeedToCache = (user_id, feed) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.set(`feed:${user_id}`, JSON.stringify(feed), "EX", process.env.USER_FEED_CACHE_DURATION, (err, result) => {
      
      if(err)
        return reject(err);

      return resolve(null);
    });
  });
};

module.exports = saveFeedToCache;