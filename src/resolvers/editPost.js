const { AuthenticationError } = require("apollo-server");
const checkPostToxicity = require("../helpers/checkPostToxicity");
const Post = require("../db_models/Post");

const editPost = async (id, text, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let post = null;
  try {
    post = await Post.findById(id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POST");
  }

  if(!post) // the post doesn't exist
    throw new Error("POST_NOT_FOUND");

  if(post.poster != user._id) // the current user is not the post creator
    throw new Error("BAD_PERMISSIONS");

  try {
    post.text = text;
    post.edited = true;
    await post.save();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_UPDATING_POST");
  }

  checkPostToxicity(post);

  return post;
};

module.exports = editPost;
