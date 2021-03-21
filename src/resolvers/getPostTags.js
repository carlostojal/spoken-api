const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const getPostTagsController = require("../helpers/controllers/posts/getPostTags");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");

const getPostTags = (post_id, user, mysqlPool) => {
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

    let hasPermission = false;
    try {
      hasPermission = await userFollowsUser(user.id, post.poster_id, mysqlPool)
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_PERMISSIONS"))
    }

    hasPermission |= user.id == post.poster_id;

    if(!hasPermission)
      return reject(new Error("BAD_PERMISSIONS"));

    let tags;
    try {
      tags = await getPostTagsController(post_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_TAGS"));
    }

    return resolve(tags);
  });
};

module.exports = getPostTags;