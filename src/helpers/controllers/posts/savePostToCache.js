
const savePostToCache = async (post) => {

  let redisClient;
  try {
    redisClient = await require("../../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.set(`post:${post.id}`, JSON.stringify(post), "EX", process.env.POST_CACHE_DURATION, (err, result) => {

    if(err)
      throw err;

    return null;
  });
};

module.exports = savePostToCache;