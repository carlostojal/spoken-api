
const getPostRatings = async () => {

  let redisClient;
  try {
    redisClient = await require("../../config/redis");
  } catch(e) {
    throw e;
  }

  redisClient.get("post_ratings", (err, result) => {

    if(err)
      throw err;

    result = result ? JSON.parse(result) : [];

    return result;
  });
};

module.exports = getPostRatings;