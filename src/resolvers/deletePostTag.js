const { AuthenticationError } = require("apollo-server");
const Tag = require("../db_models/Tag");
const Post = require("../db_models/Post");

const deletePostTag = async (tag_id, post_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let tag = null;
  try {
    tag = await Tag.findById(tag_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_TAG");
  }

  if(!tag)
    throw new Error("TAG_NOT_FOUND");

  let post = null;
  try {
    post = await Post.findById(post_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_POST");
  }

  if(!post)
    throw new Error("POST_NOT_FOUND");

  if(post.promoted)
    throw new Error("POST_IS_PROMOTED");

  try {
    if(!post.tags.includes(tag_id))
      throw new Error("TAG_NOT_PRESENT");
    post.tags.pop(tag_id);
    await post.save();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_ADDING_TAG");
  }

  return tag;
};

module.exports = deletePostTag;