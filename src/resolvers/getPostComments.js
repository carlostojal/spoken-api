const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const getCommentsByPostId = require("../helpers/controllers/posts/getCommentsByPostId");
const formatPost = require("../helpers/formatPost");

const getPostComments = (page, perPage, post_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // get the post from the DB
    let post = null;
    try {
      post = await getPostById(post_id, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    // check if the user follows who made the post
    let has_permission = user.id == post.poster_id;
    if(!has_permission) {
      try {
        has_permission = await userFollowsUser(user.id, post.poster_id, mysqlPool);
      } catch(e) {
        return reject(new Error("ERROR_CHECKING_PERMISSIONS"));
      }
    }

    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    // get comments from the DB
    let comments = null;
    try {
      comments = await getCommentsByPostId(post_id, page, perPage, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_COMMENTS"));
    }

    comments.map((comment) => {
      comment = formatPost(comment);
    });

    return resolve(comments);
  });
};

module.exports = getPostComments;
