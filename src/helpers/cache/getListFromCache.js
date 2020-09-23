
const getListFromCache = (key, redisClient) => {

  return new Promise((resolve, reject) => {
    redisClient.lrange(key, 0, -1, (error, result) => {
      
      if(error) {
        console.error(error);
        return reject(new Error("ERROR_READING_CACHE"));
      }
      
      return resolve(result);
    });
  });
}

module.exports = getListFromCache;