const { AuthenticationError } = require("apollo-server");
const getPostById = require("../helpers/controllers/posts/getPostById");
const getTagById = require("../helpers/controllers/posts/getTagById");
const addPostTagController = require("../helpers/controllers/posts/addPostTag");

const addPostTag = (post_id, tag_id, user, mysqlPool) => {
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

    if(post.promoted)
      return reject(new Error("POST_IS_PROMOTED"));

    let tag = null;
    try {
      tag = await getTagById(tag_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_TAG"));
    }

    if(!tag)
      return reject(new Error("TAG_NOT_FOUND"));

    try {
      await addPostTagController(post_id, tag_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_ADDING_TAG"));
    }

    return resolve(tag);
  });
};

module.exports = addPostTag;