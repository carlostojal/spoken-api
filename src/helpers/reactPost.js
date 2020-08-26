const Post = require("../models/Post");
const PostReaction = require("../models/PostReaction");
const userHasViewPermission = require("./userHasViewPermission");
const { AuthenticationError } = require("apollo-server");

const reactPost = (post_id, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // find and populate post from ID
    Post.findById(post_id).populate({
      path: "poster",
      populate: {
        path: "followers"
      }
    }).exec((err, post) => {

      if (err) return reject(new Error("ERROR_FINDING_POST"));

      if (!post) return reject(new Error("POST_NOT_FOUND"));

      const user_has_permission = userHasViewPermission(user, post)

      if(!user_has_permission)
        return reject(new Error("BAD_PERMISSIONS"));

      // find if this reaction was already created
      PostReaction.findOne({ user: user._id, post: post._id }).then(async (reaction) => {

        // the reaction was not added, so create a new one
        if (!reaction) {
          const newReaction = new PostReaction({
            time: Date.now().toString(),
            post: post._id,
            user: user._id
          });

          // save the reaction to the database
          try {
            await newReaction.save();
            post.reactions.push(newReaction._id);
          } catch(e) {
            console.log(e);
            return reject(new Error("ERROR_SAVING_REACTION"));
          }
        } else { // the reaction already exists, so remove it
          for(let i = 0; i < post.reactions.length; i++) {
            if(post.reactions[i].user == user._id && post.reactions[i].post == post._id) {
              post.reactions.splice(i, 1);
              break;
            }
          }
        }

        // save the post with the changes made
        try {
          await post.save();
          return resolve(post);
        } catch(e) {
          console.log(e);
          return reject(new Error("ERROR_REGISTERING_REACTION"));
        }
      }).catch((e) => {
        console.log(e);
        return reject(new Error("ERROR_CREATING_REACTION"));
      });
    });
  });
};

module.exports = reactPost;