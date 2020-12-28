const { AuthenticationError } = require("apollo-server");
const getFollowRelations = require("../helpers/controllers/relations/getFollowRelations");
const formatRelation = require("../helpers/formatRelation");

const getFollowing = (user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let result = null;
    try {
      result = await getFollowRelations(user.id, true);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_RELATIONS"));
    }

    if(!result)
      return resolve(null);

    let following = [];
      
    try {
      for(let i = 0; i < result.length; i++) {
        if(result[i].follows_id != user.id)
          following[i] = formatRelation(result[i]);
      }
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_RELATIONS"));
    }

    return resolve(following);
  });
};

module.exports = getFollowing;