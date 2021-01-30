const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const getReactions = require("../helpers/controllers/reactions/getReactions");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");

const getPostReactions = (page, perPage, post_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post = null;
    try {
      post = await getPostById(post_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    let has_permission = false;
    try {
      has_permission = await userFollowsUser(user.id, post.poster_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_PERMISSIONS"));
    }

    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    let reactions = null;
    try {
      reactions = await getReactions(post_id, page, perPage, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_REACTIONS"));
    }

    return resolve(reactions);
  });
};

module.exports = getPostReactions;