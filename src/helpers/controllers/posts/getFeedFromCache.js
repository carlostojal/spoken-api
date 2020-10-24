
const getFeedFromCache = (page, user_id, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.LRANGE(`feed:${user_id}:${page}`, 0, -1, (err, result) => {

      if(err)
        return reject(err);

      return resolve(result);
    });
  });
};

module.exports = getFeedFromCache;