const { AuthenticationError } = require("apollo-server-errors");
const getPostById = require("../helpers/controllers/posts/getPostById");
const saveOrUpdatePostAttention = require("../helpers/usage/saveOrUpdatePostRating");

const capturePostAttention = (post_id, view_time, reacted, shared, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post;
    try {
      post = await getPostById(post_id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    const text_len = post.text.split();

    let reading_score = view_time / (text_len * parseFloat(process.env.WORD_READING_DURATION));
    if(reading_score > 1)
      reading_score = 1;
    const reacted_score = reacted ? 1 : 0;
    const shared_score = shared ? 1 : 0;

    const relevance = 
      (reading_score * parseFloat(process.env.READING_RELEVANCE_WEIGHT)) + 
      (reacted_score * parseFloat(process.env.REACTION_RELEVANCE_WEIGHT)) + 
      (shared_score * parseFloat(process.env.SHARE_RELEVANCE_WEIGHT));

    try {
      await saveOrUpdatePostAttention(post_id, user.id, relevance)
    } catch(e) {
      return reject(new Error("ERROR_SAVING_ATTENTION"));
    }

    return resolve(true);
  });
};

module.exports = capturePostAttention;