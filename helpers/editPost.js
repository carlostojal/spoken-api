const Post = require("../models/Post");
const User = require("../models/User");

const editPost = (id, text, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user.posts.includes(id)) 
      return reject(new Error("This post is not from the logged in user."));

    const query = Post.findOne({ _id: id });
    query.populate("poster", "_id name surname username profile_pic_url");
    query.exec((err, post) => {

      if(err)
        return reject(err);

      // don't edit if the text was not changed to avoid unneccessary DB calls and processing
      if(post.text == text)
        return resolve(post);
      
      post.text = text;
      post.edited = true;
      post.save().then(() => {
        console.log("Post edited.");
        return resolve(post);
      }).catch((error) => {
        reject(error);
      });
    });
  });
};

module.exports = editPost;