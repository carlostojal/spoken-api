const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const formatPost = require("../helpers/formatPost");
const checkCommentToxicity = require("../helpers/checkCommentToxicity");
const insertPost = require("../helpers/controllers/posts/insertPost");

const commentPost = (post_id, user, text) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
    
    let post = null;

    try {
      post = await getPostById(post_id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    let has_permission = false;

    try {
      has_permission = await userFollowsUser(user.id, post.poster_id);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_PERMISSION"));
    }

    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    const comment = {
      user_id: user.id,
      original_post_id: post.id,
      text
    };

    try {
      await insertPost(comment);
    } catch(e) {
      return reject(new Error("ERROR_REGISTERING_COMMENT"));
    }

    try {
      post = formatPost(post);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    try {
      checkCommentToxicity(comment);
    } catch(e) {

    }

    return resolve(post);
  });
};

module.exports = commentPost;
