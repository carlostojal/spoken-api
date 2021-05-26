
const saveUserToCache = async (user) => {

  let redisClient;
  try {
    redisClient = await require("../../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.set(`user:${user.id}`, JSON.stringify(user), "EX", process.env.USER_DATA_CACHE_DURATION, (err, result) => {

    if(err)
      throw err;

    return null;
  });
};

module.exports = saveUserToCache;