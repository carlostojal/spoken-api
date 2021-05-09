const Post = require("../../../db_models/Post");
const User = require("../../../db_models/User");

const getFeed = (user_id) => {
  return new Promise(async (resolve, reject) => {

    const cur_user = await User.findById(user_id);
    
    let posts = [];
    try {
      posts = await Post.find({$or: [
        {poster: {$in: cur_user.following}},
        {poster: user_id}
      ]})
        .populate("poster")
        .populate("poster.profile_pic")
        .populate("media")
        .populate("tags")
        .populate("reactions")
        .populate("comments")
        .sort([["time", -1]]);
    } catch(e) {
      console.error(e);
      return reject(e);
    }

    return resolve(posts);
  });
};

module.exports = getFeed;