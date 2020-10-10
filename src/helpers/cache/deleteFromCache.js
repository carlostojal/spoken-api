
const deleteFromCache = (key, field, redisClient) => {

  return new Promise((resolve, reject) => {
    // hash
    if(field) {
      redisClient.hdel(key, field, (error, result) => {

        if(error) {
          
          return reject(new Error("ERROR_MANIPULATING_CACHE"));
        }

        return resolve(result);
      });
    } else {
      redisClient.del(key, (error, result) => {
        
        if(error) {
          
          return reject(new Error("ERROR_MANIPULATING_CACHE"));
        }
        return resolve(result);
      });
    }
  });
}

module.exports = deleteFromCache;