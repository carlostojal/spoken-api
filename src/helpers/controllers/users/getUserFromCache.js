
const getUserFromCache = (id) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.get(`user:${id}`, (err, result) => {

      if(err)
        return reject(err);

      let user = null;
      try {
        user = JSON.parse(result)
      } catch(e) {
        return reject(new Error("ERROR_PARSING_USER"));
      }

      return resolve(user);
    });
  });
};

module.exports = getUserFromCache;