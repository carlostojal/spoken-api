const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const insertPost = require("../helpers/controllers/posts/insertPost");
const formatPost = require("../helpers/formatPost");
const checkPostToxicity = require("../helpers/checkPostToxicity");

const sharePost = (post_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // get the post from ID
    let post = null;
    try {
      post = await getPostById(post_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // the post doesn't exist
    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    // check if the user follows who made the post
    let has_permission = user.id == post.poster_id;
    if(!has_permission) {
      try {
        has_permission = await userFollowsUser(user.id, post.poster_id, mysqlPool);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CHECKING_PERMISSION"));
      }
    }

    // the user doesn't follow who made the post
    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    // create the share post object
    const share_post = {
      user_id: user.id,
      original_post_id: post_id
    }

    // register a new post by this user, that will later reference the shared post
    try {
      await insertPost(share_post, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // get post populated from DB
    try {
      post = await getPostById(share_post.id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // format post to be sent
    try {
      post = formatPost(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if post text is toxic
    checkPostToxicity(post, mysqlPool);

    return resolve(post);
  });
};

module.exports = sharePost;
