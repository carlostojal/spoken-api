
const listCache = (key, value, ttl, overwrite_ttl, redisClient) => {

  // Params:
  // overwrite_ttl: if true, the TTL is updated no matter the key is present or not

  return new Promise((resolve, reject) => {

    redisClient.exists(key, (error, exists) => {

      if(error) {
        console.error(error);
        return reject(new Error("ERROR_READING_CACHE"));
      }

      if(exists || always_cache) {
        redisClient.lpush(key, value, (error, result) => {

          if(error) {
            console.error(error);
            return reject(new Error("ERROR_WRITING_CACHE"));
          }

          if(!exists || overwrite_ttl) {
            redisClient.expire(key, ttl, (error, result) => {

              if(error) {
                console.error(error);
                return reject(new Error("ERROR_SETTING_CACHE_TTL"));
              }

              return resolve();
            });
          } else {
            return resolve();
          }
        });
      } else {
        return resolve();
      }
    });
  });
};

module.exports = listCache;