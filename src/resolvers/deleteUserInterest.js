const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const Tag = require("../db_models/Tag");

const deleteUserInterest = async (tag_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  if(!user.interests.includes(tag_id))
    throw new Error("INTEREST_NOT_ADDED");

  let tag = null;
  try {
    tag = await Tag.findById(tag_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_TAG");
  }

  if(!tag)
    throw new Error("TAG_NOT_FOUND");

  let cur_user = null;
  try {
    cur_user = await User.findById(user._id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  cur_user.interests.pop(tag_id);

  try {
    await cur_user.save();
  } catch(e) {
    throw new Error("ERROR_SAVING_USER");
  }

  return cur_user;
};

module.exports = deleteUserInterest;