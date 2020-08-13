const User = require("../models/User");
const Post = require("../models/Post");

const createPost = (text, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      reject(new AuthenticationError("Bad authentication"));

    const post = new Post({ // create post
      poster: context.user._id,
      time: Date.now().toString(),
      text: text
    });

    post.save().then((result) => { // save post
      console.log("Post made");
      let query = Post.findOne({_id: result._id}, "_id time text"); // find post from ID
      query.populate("poster", "name surname username profile_pic_url"); // populate poster info from poster ID
      query.exec((err, post) => {
        if (err) reject(err);
        User.findOne({_id: context.user._id}, (err, result) => { // update user posts array
          if (err) reject(err);
          result.posts.push(post._id);
          result.save().then((err, result) => {
            console.log("Post created.");
            resolve(post);
          })
        });
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = createPost;