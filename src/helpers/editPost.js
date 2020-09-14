const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const editPost = (id, text, user) => {
  return new Promise((resolve, reject) => {

    try {
      const query = Post.findById(id);
      query.populate("poster");
      query.exec((err, post) => {

        if(err) {
          console.error(err);
          return reject(new Error("ERROR_GETTING_POST"));
        }

        // the post is not from the session user
        if(!mongoose.Types.ObjectId(user._id).equals(post.poster._id))
          return reject(new Error("BAD_PERMISSIONS"));
        
        // if the text was not changed don't edit anything (avoids unneccessary DB calls)
        if(post.text == text) 
          return resolve(post);
        
        post.text = text;
        post.edited = true;
        post.save().then(() => {
          console.log("Post edited.");
          return resolve(post);
        }).catch((err) => {
          console.error(err);
          return reject(new Error("ERROR_SAVING_CHANGES"));
        });
      
      });
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }
  });
};

module.exports = editPost;