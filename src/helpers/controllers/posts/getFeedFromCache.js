
const getFeedFromCache = async (user_id) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      throw e;
    }

    redisClient.get(`feed:${user_id}`, (err, result) => {

      if(err)
        throw err;

      return result ? JSON.parse(result) : null;
    });
};

module.exports = getFeedFromCache;