const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const commentPost = async (post_id, user, text) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");
  
  let post = null;
  try {
    post = await Post.findById(post_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POST");
  }

  if(user._id != post.poster && !user.following.includes(post.poster))
    throw new Error("BAD_PERMISSIONS");

  const comment = new Post({
    user: user._id,
    original_post: post._id,
    text
  });

  try {
    await comment.save();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_REGISTERING_COMMENT");
  }

  return post;
};

module.exports = commentPost;
