
const saveOrUpdatePostRating = (post, user_id, relevance) => {
  return new Promise(async (resolve, reject) => {

    // create the new rating object
    const obj = {
      user_id,
      ...post,
      rating: relevance,
      tags: null
    };

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
          if(rating.user_id == user_id && rating.post.id == post.id) {
            found = true;
            rating.rating = relevance;
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
      redisClient.set("post_ratings", JSON.stringify(result), "EX", process.env.POST_ATTENTION_CACHE_DURATION, (err, result) => {

        if(err)
          return reject(err);

        return resolve(null);

      });
    });
  });
};

module.exports = saveOrUpdatePostRating;