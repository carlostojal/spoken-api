
const getUserFromCache = async (id) => {

  let redisClient;
  try {
    redisClient = await require("../../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.get(`user:${id}`, (err, result) => {

    if(err)
      throw err;

    let user = null;
    try {
      user = JSON.parse(result)
    } catch(e) {
      throw new Error("ERROR_PARSING_USER");
    }

    return user;
  });
};

module.exports = getUserFromCache;