const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const Tag = require("../db_models/Tag");

const deleteUserInterest = (tag_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!user.interests.includes(tag_id))
      return reject(new Error("INTEREST_NOT_ADDED"));

    let tag = null;
    try {
      tag = await Tag.findById(tag_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_TAG"));
    }

    if(!tag)
      return reject(new Error("TAG_NOT_FOUND"));

    let cur_user = null;
    try {
      cur_user = await User.findById(user._id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    cur_user.interests.pop(tag_id);

    try {
      await cur_user.save();
    } catch(e) {
      return reject(new Error("ERROR_SAVING_USER"));
    }
  });
};

module.exports = deleteUserInterest;