const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const FollowRelation = require("../db_models/FollowRelation");

const acceptFollowRequest = (user_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1 = null;
    try {
      user1 = await User.findById(user_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user1)
      return reject(new Error("USER_NOT_FOUND"));

    let relation;
    try {
      relation = await FollowRelation.findOne({user: user_id, follows: user._id});
    } catch(e) {
      return reject(new Error("ERROR_GETTING_RELATION"));
    }

    try {
      let cur_user = await User.findById(user._id);
      cur_user.followers.push(user1._id);
      user1.following.push(cur_user._id);
      await cur_user.save();
      await user1.save();
      relation.accepted = true;
      await relation.save();
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_ACCEPTING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = acceptFollowRequest;