const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");
const PostView = require("../db_models/PostView");

const collectPostView = (post_id, user_lat, user_long, user_platform, user_os, view_time, user) => {
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

    if(!post.viewers.includes(user._id)) {
      post.viewers.push(user._id);
      try {
        await post.save();
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_SAVING_POST"));
      }
    }
    
    const postView = new PostView({
      user: user._id,
      post: post_id,
      user_location: {
        latitude: user_lat,
        longitude: user_long,
      },
      user_platform,
      user_os,
      view_time
    });

    try {
      await postView.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_COLLECTING_VIEW"));
    }

    return resolve(post);
  });
};

module.exports = collectPostView;