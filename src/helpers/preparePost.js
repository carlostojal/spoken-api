const PostReaction = require("../models/PostReaction");
const mediaIdToUrl = require("./mediaIdToUrl");

const preparePost = (post, user) => {
  return new Promise(async (resolve, reject) => {

    if(post.media)
      post.media_url = mediaIdToUrl(post.media);

    let reaction;

    try {
      reaction = await PostReaction.findOne({ post: post._id, user: user._id });
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_REACTION"));
    }

    post.user_reacted = reaction ? true : false;

    return resolve(post);

  });
};

module.exports = preparePost;