const { AuthenticationError } = require("apollo-server");
const getUserFromCache = require("../helpers/controllers/users/getUserFromCache");
const User = require("../db_models/User");
const FollowRelation = require("../db_models/FollowRelation");

const getUserData = (id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user) return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!id)
      id = user.id;

    let returnUser = null;

    try {
      returnUser = await getUserFromCache(id);
      if(!returnUser)
        returnUser = await User.findById(id).populate("profile_pic");
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    try {
      const relation = FollowRelation.findOne({user: user.id, follows: id});
      returnUser.is_followed = relation ? true : false;
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_RELATION"));
    }

    returnUser.is_himself = !id || id == user.id;

    return resolve(returnUser);
  });
}

module.exports = getUserData;