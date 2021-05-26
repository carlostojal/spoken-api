const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../db_models/FollowRelation");

const getFollowRequests = async (user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let requests = [];
  try {
    requests = await FollowRelation.find({follows: user._id, accepted: false, ignored: false})
      .populate("user")
      .populate("user.profile_pic");
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_RELATIONS");
  }

  return requests;
};

module.exports = getFollowRequests;