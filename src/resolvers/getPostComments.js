const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const getPostComments = async (post_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  // get the post from the DB
  let post = null;
  try {
    post = await Post.findById(post_id)
      .populate("poster");
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POST");
  }

  if(!post)
    throw new Error("POST_NOT_FOUND");
  
  if(!user._id.equals(post.poster._id) && (user.profile_privacy_type == "private" && !user.following.includes(post.poster))) {
    throw new Error("BAD_PERMISSIONS");
  }

  // get comments from the DB
  let comments = [];
  try {
    comments = await Post.find({original_post: post_id})
      .populate("poster")
      .populate("poster.profile_pic")
      .populate("media")
      .populate("tags")
      .populate("reactions")
      .populate("comments")
      .sort([["time", -1]]);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_COMMENTS");
  }

  return comments;
};

module.exports = getPostComments;
