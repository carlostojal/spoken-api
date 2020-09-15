const { AuthenticationError } = require("apollo-server");
const PostComment = require("../models/PostComment");
const Post = require("../models/Post");
const deleteFromCache = require("./deleteFromCache");
const preparePost = require("./preparePost");
const userHasPostPermission = require("./userHasPostPermission");

const commentPost = (post_id, user, text, redisClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
    
    let post = null;

    try {
      post = await Post.findById(post_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    let hasPermission = false;
    
    try {
      hasPermission = await userHasPostPermission(post_id, user._id, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_PERMISSION"));
    }

    if(!hasPermission)
      return reject(new Error("BAD_PERMISSIONS"));

    const comment = new PostComment({
      time: Date.now().toString(),
      post: post_id,
      user: user._id,
      text
    });

    try {
      await comment.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_SAVING_COMMENT"));
    }

    try {
      post = await preparePost(post, user);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_PREPARING_POST"));
    }

    try {
      await deleteFromCache(`comments-post-${post_id}`, null, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_RESETING_CACHE"));
    }

    return resolve(post);
  });
};

module.exports = commentPost;