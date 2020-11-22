
const getPostFromCache = (post_id) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.get(`post:${post_id}`, (err, result) => {

      if(err)
        return reject(err);
  
      if(result) {
        return resolve(JSON.parse(result));
      }

      return resolve(null);
    });
  });
};

module.exports = getPostFromCache;