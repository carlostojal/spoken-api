
const getFromCache = (key, field, redisClient) => {

  return new Promise((resolve, reject) => {
    // hash
    if(field) {
      redisClient.hmget(key, field, (error, result) => {

        if(error) {
          console.error(error);
          return reject(new Error("ERROR_READING_CACHE"));
        }

        return resolve(result);
      });
    } else {
      redisClient.get(key, (error, result) => {
        
        if(error) {
          console.error(error);
          return reject(new Error("ERROR_READING_CACHE"));
        }
        return result(result);
      });
    }
  });
}

module.exports = getFromCache;