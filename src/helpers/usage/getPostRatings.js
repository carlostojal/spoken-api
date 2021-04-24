
const getPostRatings = () => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../config/redis");
    } catch(e) {
      return reject(e);
    }

    redisClient.get("post_ratings", (err, result) => {

      if(err)
        return reject(err);

      result = result ? JSON.parse(result) : [];

      return resolve(result);
    });
  });
};

module.exports = getPostRatings;