const { AuthenticationError } = require("apollo-server");
const getFromCache = require("../helpers/cache/getFromCache");
const cache = require("../helpers/cache/cache");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const formatComment = require("../helpers/formatComment");

const getPostComments = (page, perPage, post_id, user, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // try to get the comments from cache
    let comments = null;
    try {
      comments = await getFromCache(`comments:${post_id}`, `page_${page}`, redisClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_COMMENTS"));
    }

    // comments were in cache
    if(comments)
      return resolve(JSON.parse(comments));

    // get the post from the DB
    let post = null;
    try {
      post = await getPostById(post_id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    // check if the user follows who made the post
    let has_permission = false;
    try {
      has_permission = await userFollowsUser(user.id, post.poster_id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_PERMISSIONS"));
    }

    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    // get comments from the DB
    try {
      comments = await getCommentsByPostId(post_id, page, perPage, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_COMMENTS"));
    }

    comments.map((comment) => {
      comment = formatComment(comment);
    });

    // save to cache
    try {
      cache(`comments:${post_id}`, `page_${page}`, JSON.stringify(comments), process.env.POST_COMMENTS_CACHE_DURATION, true, true, redisClient);
    } catch(e) {

    }

    return resolve(comments);
  });
};

module.exports = getPostComments;