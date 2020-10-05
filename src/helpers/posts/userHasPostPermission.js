const { Types } = require("mongoose");
const Post = require("../../models/Post");
const FollowRelation = require("../../models/FollowRelation");
const listCache = require("../cache/listCache");
const getListFromCache = require("../cache/getListFromCache");

const userHasPostPermission = (post_id, user_id, redisClient) => {
  return new Promise(async (resolve, reject) => {

    let isInList;

    // check if user ID is in cache
    try {
      let cacheList = await getListFromCache(`post-authorized-users-${post_id}`, redisClient);
      isInList = cacheList.includes(user_id);
    } catch(e) {
      
      return reject(new Error("ERROR_READING_CACHE"));
    }

    let post;

    try {
      post = await Post.findById(post_id);
    } catch(e) {
      
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // is in cache or the poster is the user itself, so user has permission
    if(isInList || Types.ObjectId(user_id).equals(post.poster))
      return resolve(true);

    let relation = null;

    // find relation
    try {
      relation = await FollowRelation.findOne({ user: user_id, follows: post.poster, accepted: true });
    } catch(e) {
      
      return reject(new Error("ERROR_CHECKING_RELATION"));
    }

    // the session user doesn't follow the user
    if(!relation)
      return resolve(false);
    
    // add user ID to cache
    try {
      listCache(`post-authorized-users-${post_id}`, user_id, process.env.POST_AUTHORIZED_USER_CACHE_DURATION, false, redisClient);
    } catch(e) {
      
    }
    
    return resolve(true);
  });
};

module.exports = userHasPostPermission;