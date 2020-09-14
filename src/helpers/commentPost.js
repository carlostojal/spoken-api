const { AuthenticationError } = require("apollo-server");
const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const FollowRelation = require("../models/FollowRelation");
const cache = require("./cache");
const preparePost = require("./preparePost");

const commentPost = (post_id, user, text) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    try {

      let post;
      
      try {
        post = await Post.findById(post_id);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_GETTING_POST"));
      }

      if(!post)
        return reject(new Error("POST_NOT_EXISTENT"));
      
      let relation;

      try {
        relation = await FollowRelation.findOne({ user: user._id, follows: post.poster, accepted: true });
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CHECKING_PERMISSION"));
      }

      if(!relation)
        return reject(new Error("BAD_PERMISSIONS"));

      const comment = new PostComment({
        time: Date.now().toString(),
        post: post._id,
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

      return resolve(post);

    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }
  });
};

module.exports = commentPost;