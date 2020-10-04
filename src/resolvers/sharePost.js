const { AuthenticationError } = require("apollo-server");
const generateId = require("../helpers/generateId");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const insertPost = require("../helpers/controllers/posts/insertPost");
const associateOriginalPost = require("../helpers/controllers/posts/associateOriginalPost");
const formatPost = require("../helpers/formatPost");
const checkPostToxicity = require("../helpers/checkPostToxicity");

const sharePost = (post_id, text, user, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // get the post from ID
    let post = null;
    try {
      post = await getPostById(post_id, mysqlClient);
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
        has_permission = await userFollowsUser(user.id, post.poster_id, mysqlClient);
      } catch(e) {
        return reject(new Error("ERROR_CHECKING_PERMISSION"));
      }
    }

    // the user doesn't follow who made the post
    if(!has_permission)
      return reject(new Error("BAD_PERMISSIONS"));

    // create the share post object
    const share_post = {
      id: generateId(),
      user_id: user.id,
      time: Date.now(),
      text: text
    }

    // register a new post by this user, that will later reference the shared post
    try {
      await insertPost(share_post, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // reference the original post
    try {
      await associateOriginalPost(share_post.id, post_id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_REFERENCING_ORIGINAL_POST"));
    }

    // get post populated from DB
    try {
      post = await getPostById(share_post.id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // format post to be sent
    try {
      post = formatPost(post);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if post text is toxic
    checkPostToxicity(post);

    return resolve(post);
  });
};

module.exports = sharePost;
