const { AuthenticationError } = require("apollo-server");
const Post = require("../models/Post");
const PostReaction = require("../models/PostReaction");
const FollowRelation = require("../models/FollowRelation");
const preparePost = require("./preparePost");

const reactPost = (post_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    try {
      let post;

      // find post
      try {
        post = await Post.findById(post_id);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_GETTING_POST"));
      }

      if(!post)
        return reject(new Error("POST_NOT_FOUND"));

      let relation;

      // find follow relation
      try {
        relation = await FollowRelation.findOne({ user: user._id, follows: post.poster, accepted: true });
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CHECKING_PERMISSIONS"));
      }

      if(!relation) // the session user doesn't follow the user who made the post
        return reject(new Error("BAD_PERMISSIONS"));
      
      let post_reaction;

      // find post reaction
      try {
        post_reaction = await PostReaction.findOne({ user: user._id, post: post._id });
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CHECKING_REACTION"));
      }

      // the reaction was registered, so remove this time
      if(post_reaction) {
        try {
          await post_reaction.remove();
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_REMOVING_REACTION"));
        }
      } else { // the reaction was not registered
        const new_reaction = new PostReaction({
          time: Date.now().toString(),
          post: post._id,
          user: user._id
        });
        try {
          await new_reaction.save();
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_SAVING_REACTION"));
        }
      }

      try {
        post = await preparePost(post, user);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_PREPARING_POST"));
      }

      return resolve(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

  });
};

module.exports = reactPost;