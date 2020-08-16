const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const Post = require("../models/Post");
const mediaIdToUrl = require("./mediaIdToUrl");

const getUserFeed = (page, perPage, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      return reject(new AuthenticationError("Bad authentication."));

    // get all posts which poster ID is in the current user following array
    const query = User.findOne({ _id: context.user._id });
    query.populate({
      path: "following",
      populate: {
        path: "follows"
      }
    });
    query.exec((error, user) => {
      if (error) return reject(error);

      let followingArray = [];

      user.following.map((relation) => {
        if(relation.accepted)
          followingArray.push(relation.follows._id);
      });

      followingArray.push(context.user._id);

      const query = Post.find({ poster: { $in: followingArray }});
      query.populate("poster", "_id name surname username profile_pic_url");
      query.limit(perPage);
      query.skip(perPage * (page - 1));
      query.sort({time: -1});
      query.exec((error, posts) => {
        if (error) return reject(error);
        posts.map((post) => {
          // post has media
          if(post.media) {
            post.media_url = mediaIdToUrl(post.media);
          }
        })
        resolve(posts);
      });
    });
  });
};

module.exports = getUserFeed;