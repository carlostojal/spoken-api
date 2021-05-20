const { AuthenticationError } = require("apollo-server");
const Post = require("../db_models/Post");
const PostReaction = require("../db_models/PostReaction");

const reactPost = (post_id, user_lat, user_long, user_platform, user_os, user) => {
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

    if(user._id != post.poster && !user.following.includes(post.poster))
      return reject(new Error("BAD_PERMISSIONS"));

    let reaction = null;
    try {
      reaction = await PostReaction.findOne({user: user._id, post: post._id});
    } catch(e) {
      return reject(new Error("ERROR_GETTING_REACTION"));
    }

    try {
      // have reacted, so remove
      if(reaction) {

        post.reactions.pop(user._id);
        await post.save();
        await reaction.remove()

      } else {
        // register new reaction

        post.reactions.push(user._id);
        await post.save();
        let new_reaction = new PostReaction({
          user: user._id,
          post: post._id,
          user_location: user_lat && user_long ? 
          {
            coordinates: [user_lat, user_long]
          } : null,
          user_platform,
          user_os
        });
        await new_reaction.save();
      }
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_PERSISTING_REACTION"));
    }

    return resolve(post);
  });
};

module.exports = reactPost;