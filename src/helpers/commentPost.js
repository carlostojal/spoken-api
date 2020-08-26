const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const userHasViewPermission = require("./userHasViewPermission");
const { AuthenticationError } = require("apollo-server");

const commentPost = (post_id, user, text) => {
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

      const newComment = new PostComment({
        time: Date.now().toString(),
        post: post._id,
        user: user._id,
        text
      });

      // save the comment to the database
      newComment.save().then(() => {
        post.comments.push(newComment._id);
      }).catch((e) => {
        console.log(e);
        return reject(new Error("ERROR_SAVING_COMMENT"));
      });

      // save the post with the changes made
      post.save().then(() => {
        return resolve(post);
      }).catch((e) => {
        console.log(e);
        return reject(new Error("ERROR_REGISTERING_COMMENT"));
      });
    });
  });
};

module.exports = commentPost;