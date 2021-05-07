const { AuthenticationError } = require("apollo-server");
const checkPostToxicity = require("../helpers/checkPostToxicity");
const Post = require("../db_models/Post");

const editPost = (id, text, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post = null;
    try {
      post = await Post.findById(id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post) // the post doesn't exist
      return reject(new Error("POST_NOT_FOUND"));

    if(post.poster != user._id) // the current user is not the post creator
      return reject(new Error("BAD_PERMISSIONS"));

    try {
      post.text = text;
      post.edited = true;
      await post.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_UPDATING_POST"));
    }

    checkPostToxicity(post);

    return resolve(post);
  });
};

module.exports = editPost;
