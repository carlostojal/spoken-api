
const saveUserToCache = (user, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.set(`user:${user.id}`, JSON.stringify(user), "EX", process.env.USER_DATA_CACHE_DURATION, (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    })
  });
};

module.exports = saveUserToCache;