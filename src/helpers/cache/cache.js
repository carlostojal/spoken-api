
const cache = (key, field, value, ttl, always_cache, overwrite_ttl, redisClient) => {

  // Params:
  // always_cache: if false, the item is only saved if the key is present
  // overwrite_ttl: if true, the TTL is updated no matter the key is present or not

  return new Promise((resolve, reject) => {

    redisClient.exists(key, (error, exists) => {

      if(error) {
        console.error(error);
        return reject(new Error("ERROR_READING_CACHE"));
      }

      // is an hash
      if(field) {
        if(exists || always_cache) {
          redisClient.hmset(key, field, value, (error, result) => {

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
      } else { // is a string
        if(exists || always_cache) {
          redisClient.set(key, value, (error, result) => {

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
      }
    });
  });
};

module.exports = cache;