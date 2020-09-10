
const cacheIfExists = (key, field, value, ttl, redisClient) => {
  return new Promise((resolve, reject) => {

    redisClient.exists(key, (error, exists) => {

      if(error) {
        console.error(error);
        return reject(new Error("ERROR_READING_CACHE"));
      }

      // is an hash
      if(field) {
        redisClient.hmset(key, field, value, (error, result) => {

          if(error) {
            console.error(error);
            return reject(new Error("ERROR_WRITING_CACHE"));
          }

          if(!exists) {
            redisClient.expire(key, ttl, (error, result) => {

              if(error) {
                console.error(error);
                return reject(new Error("ERROR_SETTING_CACHE_TTL"));
              }

              return resolve();

            });
          }
        });
      } else { // is a string
        redisClient.set(key, value, (error, result) => {

          if(error) {
            console.error(error);
            return reject(new Error("ERROR_WRITING_CACHE"));
          }

          if(!exists) {
            redisClient.expire(key, ttl, (error, result) => {

              if(error) {
                console.error(error);
                return reject(new Error("ERROR_SETTING_CACHE_TTL"));
              }

              return resolve();
            });
          }
        });
      }
    });
  });
};

module.exports = cacheIfExists;