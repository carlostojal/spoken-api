const { AuthenticationError } = require("apollo-server");
const getUserFromCache = require("../helpers/controllers/users/getUserFromCache");
const User = require("../db_models/User");
const FollowRelation = require("../db_models/FollowRelation");

const getUserData = async (id, user) => {

  if(!user) throw new AuthenticationError("BAD_AUTHENTICATION");

  if(!id)
    id = user.id;

  let returnUser = null;

  try {
    returnUser = await getUserFromCache(id);
    if(!returnUser)
      returnUser = await User.findById(id)
        .populate("profile_pic")
        .populate("followers")
        .populate("following");
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  return returnUser;
}

module.exports = getUserData;