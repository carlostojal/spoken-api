
const getUserFromCache = (id, redisClient) => {
  return new Promise((resolve, reject) => {
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
    })
  });
};

module.exports = getUserFromCache;