
const getPostFromCache = async (post_id) => {

  let redisClient;
  try {
    redisClient = await require("../../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.get(`post:${post_id}`, (err, result) => {

    if(err)
      throw err;

    if(result)
      return JSON.parse(result);

    return null;
  });
};

module.exports = getPostFromCache;