const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");

const commentPost = (post_id, user, text) => {
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

    if(user._id != post.poster && !user.following.includes(post.poster))
      return reject(new Error("BAD_PERMISSIONS"));

    const comment = new Post({
      user: user._id,
      original_post: post._id,
      text
    });

    try {
      await comment.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REGISTERING_COMMENT"));
    }

    return resolve(post);
  });
};

module.exports = commentPost;
