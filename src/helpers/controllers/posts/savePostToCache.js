
const savePostToCache = (post) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.set(`post:${post.id}`, JSON.stringify(post), "EX", process.env.POST_CACHE_DURATION, (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    })
  });
};

module.exports = savePostToCache;