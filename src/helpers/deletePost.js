const Post = require("../models/Post");
const User = require("../models/User");

const deletePost = (id, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user.posts.includes(id)) 
      return reject(new Error("This post is not from the logged in user."));

    Post.findOne({ _id: id }).then((post) => {
      post.remove().then(() => {
        User.findOne({ _id: post.poster }).then((user) => {
          for(let i = 0; i < user.posts.length; i++) {
            if(user.posts[i]._id == id) {
              user.posts.splice(i, 1);
              i--;
              break;
            }
          }
          user.save().then(() => {
            console.log("Post deleted.");
            return resolve(post);
          }).catch((error) => {
            reject(error);
          });
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = deletePost;