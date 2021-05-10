const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const getPostComments = (post_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // get the post from the DB
    let post = null;
    try {
      post = Post.findById(post_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    if(user._id != post.poster && !user.following.includes(post.poster))
      return reject(new Error("BAD_PERMISSIONS"));

    // get comments from the DB
    let comments = [];
    try {
      comments = Post.find({original_post: post_id})
        .populate("poster")
        .populate("poster.profile_pic")
        .populate("media")
        .populate("tags")
        .populate("reactions")
        .populate("comments")
        .sort([["time", -1]]);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_COMMENTS"));
    }

    return resolve(comments);
  });
};

module.exports = getPostComments;
