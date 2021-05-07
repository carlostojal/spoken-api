const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../db_models/FollowRelation");

const getFollowRequests = (user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let requests = [];
    try {
      requests = await FollowRelation.find({follows: user._id, accepted: false, ignored: false})
        .populate("user")
        .populate("user.profile_pic");
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_RELATIONS"));
    }

    return resolve(requests);
  });
};

module.exports = getFollowRequests;