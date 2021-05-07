const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/FollowRelation");
const FollowRelation = require("../db_models/FollowRelation");

const ignoreFollowRequest = (user_id, user) => {
  return new Promise(async (resolve, reject) => {

    if (!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1 = null;
    try {
      user1 = await User.findById(user_id);
    } catch (e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if (!user1)
      return reject(new Error("USER_NOT_FOUND"));

    try {
      let relation = await FollowRelation.findOne({user: user1._id, follows: user._id});
      relation.ignored = true;
      await relation.save()
    } catch (e) {
      console.error(e);
      return reject(new Error("ERROR_IGNORING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = ignoreFollowRequest;