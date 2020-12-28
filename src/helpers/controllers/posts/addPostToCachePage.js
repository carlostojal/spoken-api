
const addPostToCachePage = (post_id, user_id, page) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.rpush(`feed:${user_id}:${page}`, post_id, (err, res) => {

      if(err)
        return reject(err);

      return resolve(null);
    })
  });
};

module.exports = addPostToCachePage;