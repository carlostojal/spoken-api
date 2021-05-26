const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const Post = require("../db_models/Post");

const getUserPosts = async (user_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  // if a user id was provided
  if(user_id) {

    let user1 = null;
    try {
      user1 = await User.findById(user_id);
    } catch(e) {
      console.error(e);
      throw new Error("ERROR_GETTING_USER");
    }

    // if the account is private, check if the user follows
    if(user1.profile_privacy_type == "private" && !user.following.includes(user1._id) && !user1._id.equals(user._id))
      throw new Error("NOT_ALLOWED");
  }

  let posts = [];
  try {
    posts = await Post.find({poster: user_id || user._id})
      .populate({
        path: "original_post",
        populate: {
          path: "poster",
          populate: {
            path: "profile_pic"
          }
        }
      })
      .populate({
        path: "poster",
        populate: {
          path: "profile_pic"
        }
      })
      .populate("media")
      .populate("tags")
      .populate("reactions")
      .populate("comments")
      .sort([["time", -1]]);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POSTS");
  }

  return posts;
};

module.exports = getUserPosts;