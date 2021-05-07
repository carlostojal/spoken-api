const { AuthenticationError } = require("apollo-server");
const Tag = require("../db_models/Tag");
const Post = require("../db_models/Post");

const addPostTag = (tag_id, post_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let tag = null;
    try {
      tag = await Tag.findById(tag_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_TAG"));
    }

    if(!tag)
      return reject(new Error("TAG_NOT_FOUND"));

    let post = null;
    try {
      post = await Post.findById(post_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    if(!post)
      return reject(new Error("POST_NOT_FOUND"));

    if(post.promoted)
      return reject(new Error("POST_IS_PROMOTED"));

    try {
      if(post.tags.includes(tag_id))
        return reject(new Error("TAG_ALREADY_ADDED"));
      post.tags.push(tag_id);
      await post.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_ADDING_TAG"));
    }

    return resolve(tag);
  });
};

module.exports = addPostTag;