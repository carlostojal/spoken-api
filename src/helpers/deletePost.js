const { AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const deletePost = (id, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    Post.findById(id).then((post) => {
      // the post is not from the logged user
      if(!mongoose.Types.ObjectId(user._id).equals(post.poster))
        return reject(new Error("BAD_PERMISSIONS"));
      
      post.remove().then(() => {
        console.log("Post deleted.");
        return resolve(post);
      }).catch((error) => {
        console.error(error);
        return reject(new Error("ERROR_REMOVING_POST"));
      });
    }).catch((error) => {
      console.error(error);
      return reject(new Error("ERROR_GETTING_POST"));
    });
  });
};

module.exports = deletePost;