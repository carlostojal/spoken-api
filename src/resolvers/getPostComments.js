const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const formatComment = require("../helpers/formatComment");

const getPostComments = (page, perPage, post_id, user, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

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
    let comments = null;
    try {
      comments = await getCommentsByPostId(post_id, page, perPage, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_COMMENTS"));
    }

    comments.map((comment) => {
      comment = formatComment(comment);
    });

    return resolve(comments);
  });
};

module.exports = getPostComments;
