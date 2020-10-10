const { AuthenticationError } = require("apollo-server");
const getFollowedRelations = require("../helpers/controllers/relations/getFollowedRelations");
const formatRelation = require("../helpers/formatRelation");

const getFollowRequests = (user, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let result = null;
    try {
      result = await getFollowedRelations(user.id, true, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_RELATIONS"));
    }

    if(!result)
      return resolve(null);

    let followers = [];
      
    try {
      for(let i = 0; i < result.length; i++) {
        if(result[i].user_id != user.id)
          followers[i] = formatRelation(result[i]);
      }
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_RELATIONS"));
    }

    return resolve(followers);
  });
};

module.exports = getFollowRequests;