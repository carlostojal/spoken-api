const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const userReacted = require("../helpers/controllers/reactions/userReacted");
const removeReaction = require("../helpers/controllers/reactions/removeReaction");
const insertReaction = require("../helpers/controllers/reactions/insertReaction");
const generateId = require("../helpers/generateId");
const formatPost = require("../helpers/formatPost");

const reactPost = (post_id, user, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post = null;
    try {
      post = await getPostById(post_id, mysqlClient);
    } catch(e) {
      
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    try {
      post = formatPost(post);
    } catch(e) {
      
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if the user follows the user who made the post
    let hasPermission = false;
    try {
      hasPermission = await userFollowsUser(user.id, post.poster.id, mysqlClient);
    } catch(e) {
      
      return reject(new Error("ERROR_CHECKING_PERMISSION"));
    }

    if(!hasPermission)
      return reject(new Error("BAD_PERMISSIONS"));
    
    // check if the current user reacted the post
    let user_reacted = false;
    try {
      user_reacted = await userReacted(user, post, mysqlClient);
    } catch(e) {
      
      return reject(new Error("ERROR_CHECKING_REACTION"));
    }

    // the reaction was registered, so remove
    if(user_reacted) {
      try {
        await removeReaction(user, post, mysqlClient);
      } catch(e) {
        
        return reject(new Error("ERROR_REMOVING_REACTION"));
      }
    } else { // the reaction was not registered, so register
      const reaction = {
        id: generateId(),
        user_id: user.id,
        post_id: post.id,
        time: Date.now()
      }
      try {
        await insertReaction(reaction, mysqlClient);
      } catch(e) {
        return reject(new Error("ERROR_SAVING_REACTION"));
      }
    }

    post.user_reacted = !user_reacted;

    return resolve(post);
  });
};

module.exports = reactPost;