
const savePostToCache = (post, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.set(`post:${post.id}`, JSON.stringify(post), "EX", process.env.POST_CACHE_DURATION, (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    })
  });
};

module.exports = savePostToCache;