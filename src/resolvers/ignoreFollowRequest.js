const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/FollowRelation");
const FollowRelation = require("../db_models/FollowRelation");

const ignoreFollowRequest = async (user_id, user) => {

  if (!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let user1 = null;
  try {
    user1 = await User.findById(user_id);
  } catch (e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  if (!user1)
    throw new Error("USER_NOT_FOUND");

  try {
    let relation = await FollowRelation.findOne({user: user1._id, follows: user._id});
    relation.ignored = true;
    await relation.save()
  } catch (e) {
    console.error(e);
    throw new Error("ERROR_IGNORING_RELATION");
  }

  return user1;
};

module.exports = ignoreFollowRequest;