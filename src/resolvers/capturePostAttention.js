const { AuthenticationError } = require("apollo-server-errors");
const getPostById = require("../helpers/controllers/posts/getPostById");
const saveOrUpdatePostRating = require("../helpers/usage/saveOrUpdatePostRating");

const capturePostAttention = (post_id, view_time, reacted, shared, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post;
    try {
      post = await getPostById(post_id, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    const text_len = post.text.split().length;

    let reading_score = view_time / (text_len * parseFloat(process.env.WORD_READING_DURATION));
    if(reading_score > 1)
      reading_score = 1;
    const reacted_score = reacted ? 1 : 0;
    const shared_score = shared ? 1 : 0;

    const relevance = 
      (reading_score * parseFloat(process.env.READING_RELEVANCE_WEIGHT))
      + (reacted_score * parseFloat(process.env.REACTION_RELEVANCE_WEIGHT))
      + (shared_score * parseFloat(process.env.SHARE_RELEVANCE_WEIGHT));

    date = new Date();

    const obj = {
      user_id: user.id,
      post: {
        id: post.id,
        text: post.text,
        poster_id: post.poster_id,
        poster_fullname: post.poster_name + " " + post.poster_surname,
        poster_username: post.poster_username,
        recency: date.getTime() - new Date(post.time).getTime()
      },
      week_day: date.getDay(),
      day_hour: date.getHours(),
      relevance
    }

    try {
      await saveOrUpdatePostRating(obj);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_SAVING_ATTENTION"));
    }

    return resolve(true);
  });
};

module.exports = capturePostAttention;