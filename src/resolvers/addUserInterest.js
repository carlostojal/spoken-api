const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const Tag = require("../db_models/Tag");

const addUserInterest = (tag_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(user.interests.includes(tag_id))
      return reject(new Error("INTEREST_ALREADY_ADDED"));

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

    cur_user.interests.push(tag_id);

    try {
      await cur_user.save();
    } catch(e) {
      return reject(new Error("ERROR_SAVING_USER"));
    }

    return resolve(cur_user);
  });
};

module.exports = addUserInterest;