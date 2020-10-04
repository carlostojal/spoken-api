const { AuthenticationError } = require("apollo-server");
const generateId = require("../helpers/generateId");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const insertComment = require("../helpers/controllers/posts/insertComment");
const formatPost = require("../helpers/formatPost");
const checkCommentToxicity = require("../helpers/checkCommentToxicity");

const commentPost = (post_id, user, text, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
    
    let post = null;

    try {
      post = await getPostById(post_id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    let has_permission = false;

    try {
      has_permission = await userFollowsUser(user.id, post.poster_id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_PERMISSION"));
    }

    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    const comment = {
      id: generateId(),
      user_id: user.id,
      post_id: post.id,
      time: Date.now(),
      text
    };

    try {
      await insertComment(comment, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_REGISTERING_COMMENT"));
    }

    try {
      post = formatPost(post);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    try {
      checkCommentToxicity(comment, mysqlClient);
    } catch(e) {

    }

    return resolve(post);
  });
};

module.exports = commentPost;
