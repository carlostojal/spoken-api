const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const deletePost = (post_id, user) => {
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

    if(post.poster != user._id)
      return reject(new Error("BAD_PERMISSIONS"));

    try {
      await post.remove();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REMOVING_POST"));
    }

    return resolve(post);
  });
};

module.exports = deletePost;