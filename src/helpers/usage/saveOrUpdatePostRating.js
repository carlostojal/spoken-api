
const saveOrUpdatePostRating = (obj) => {
  return new Promise(async (resolve, reject) => {

    let redisClient;
    try {
      redisClient = await require("../../config/redis");
    } catch(e) {
      return reject(e);
    }

    // try to get current array of ratings
    redisClient.get("post_ratings", (err, result) => {

      if(err)
        return reject(err);
      
        // if it does exist
      if(result) {

        result = JSON.parse(result);

        // try to find the current rating event exists
        let found = false;
        result.map((rating) => {
          if(rating.user_id == obj.user_id && rating.post.id == obj.post.id) {
            found = true;
            rating.relevance = obj.relevance;
          }
        });

        // if it doesn't exist, add to the array
        if(!found)
          result.push(obj);

      } else {

        // if the array doesn't exist, 
        // create a new array with the current rating event
        result = [obj];

      }

      // save the ratings array to redis
      redisClient.set("post_ratings", JSON.stringify(result), "EX", process.env.POST_RATINGS_CACHE_DURATION, (err, result) => {

        if(err)
          return reject(err);

        return resolve(null);

      });
    });
  });
};

module.exports = saveOrUpdatePostRating;