const Post = require("../../../db_models/Post");
const User = require("../../../db_models/User");

const getFeed = async (user_id) => {

  const cur_user = await User.findById(user_id);
  
  let posts = [];
  try {
    posts = await Post.find({$or: [
      {poster: {$in: cur_user.following}},
      {poster: user_id}
    ]})
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
    throw e;
  }

  return posts;
};

module.exports = getFeed;