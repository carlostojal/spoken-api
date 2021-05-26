const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const deletePost = async (post_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");
  
  let post = null;
  try {
    post = await Post.findById(post_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POST");
  }

  if(!post)
    throw new Error("POST_NOT_FOUND");

  if(!post.poster.equals(user._id))
    throw new Error("BAD_PERMISSIONS");

  try {
    await post.remove();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_REMOVING_POST");
  }

  return post;
};

module.exports = deletePost;