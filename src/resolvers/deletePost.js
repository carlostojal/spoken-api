const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const removePostById = require("../helpers/controllers/posts/removePostById");
const formatPost = require("../helpers/formatPost");

const deletePost = (id, user, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
    
    let post = null;
    try {
      post = await getPostById(id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));


    if(post.poster_id != user.id)
      return reject(new Error("BAD_PERSMISSIONS"));

    try {
      await removePostById(id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REMOVING_POST"));
    }

    console.log("Post deleted.");

    try {
      post = formatPost(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    return resolve(post);
  });
};

module.exports = deletePost;