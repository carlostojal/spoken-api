
const addPostToCachePage = (post_id, user_id, page, redisClient) => {
  return new Promise((resolve, reject) => {
    redisClient.rpush(`feed:${user_id}:${page}`, post_id, (err, res) => {

      if(err)
        return reject(err);

      return resolve(null);
    })
  });
};

module.exports = addPostToCachePage;