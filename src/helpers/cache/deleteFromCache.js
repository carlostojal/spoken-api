
const deleteFromCache = (key, field) => {

  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../config/redis");
    } catch(e) {
      return reject(new Error("CONNECTION_ERROR"));
    }

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