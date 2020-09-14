const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const FollowRelation = require("../models/FollowRelation");
const getFromCache = require("./getFromCache");
const cache = require("./cache");

const getPostComments = (page, perPage, post_id, user, redisClient) => {
  return new Promise(async (resolve, reject) => {

    let post;

    // get post to make checks
    try {
      post = await Post.findById(post_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    let relation;

    // check follow relation
    try {
      relation = await FollowRelation.findOne({ user: user._id, follows: post.poster, accepted: true });
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_RELATION"));
    }

    if(!relation)
      return reject(new Error("BAD_PERMISSIONS"));

    let comments;

    // get from cache
    try {
      comments = await getFromCache(`comments-post-${post_id}`, `page-${page}`, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_READING_CACHE"));
    }

    // exists in cache, so return from cache
    if(comments[0]) {
      console.log("Got post comments from cache.");
      return resolve(JSON.parse(comments[0]));
    }

    // doesn't exist in cache. get from DB
    const query = PostComment.find({ post: post_id });
    query.limit(perPage);
    query.skip(perPage * (page - 1));
    query.sort({time: -1});
    query.exec(async (error, comments) => {

      if(error) {
        console.error(error);
        return reject(new Error("ERROR_GETTING_COMMENTS"));
      }

      // save the data to cache
      try {
        cache(`comments-post-${post_id}`, `page-${page}`, JSON.stringify(comments), process.env.POST_COMMENTS_CACHE_DURATION, true, false, redisClient)
        console.log("Saved post comments to cache.");
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CACHING_COMMENTS"));
      }

      console.log("Got post comments from cache.");
      return resolve(comments);
    });
  });
};

module.exports = getPostComments;