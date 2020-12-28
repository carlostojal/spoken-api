const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const editPostById = require("../helpers/controllers/posts/editPostById");
const checkPostToxicity = require("../helpers/checkPostToxicity");
const formatPost = require("../helpers/formatPost");

const editPost = (id, text, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let post = null;
    try {
      post = await getPostById(id);
    } catch(e) {
      
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post) // the post doesn't exist
      return reject(new Error("POST_NOT_FOUND"));

    try {
      post = formatPost(post);
    } catch(e) {
      
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    if(post.poster.id != user.id) // the current user is not the post creator
      return reject(new Error("BAD_PERMISSIONS"));

    try {
      await editPostById(id, text);
    } catch(e) {
      
      return reject(new Error("ERROR_UPDATING_POST"));
    }

    checkPostToxicity(post);

    return resolve(post);
  });
};

module.exports = editPost;
