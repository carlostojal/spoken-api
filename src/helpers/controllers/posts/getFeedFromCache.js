
const getFeedFromCache = (user_id) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.get(`feed:${user_id}`, (err, result) => {

      if(err)
        return reject(err);

      return resolve(result ? JSON.parse(result) : null);
    });
  });
};

module.exports = getFeedFromCache;