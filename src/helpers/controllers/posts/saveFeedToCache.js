
const saveFeedToCache = async (user_id, feed) => {

  let redisClient;
  try {
    redisClient = await require("../../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.set(`feed:${user_id}`, JSON.stringify(feed), "EX", process.env.USER_FEED_CACHE_DURATION, (err, result) => {
    
    if(err)
      throw err;

    return null;
  });
};

module.exports = saveFeedToCache;