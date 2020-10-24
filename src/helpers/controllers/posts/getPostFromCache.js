
const getPostFromCache = (post_id, redisClient) => {
  return new Promise((resolve, reject) => {
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