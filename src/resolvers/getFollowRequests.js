const { AuthenticationError } = require("apollo-server");
const getFollowedRelations = require("../helpers/controllers/relations/getFollowedRelations");
const formatRelation = require("../helpers/formatRelation");

const getFollowRequests = (user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let requests = null;
    try {
      requests = await getFollowedRelations(user.id, false, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_RELATIONS"));
    }

    if(!requests)
      return resolve(null);
      
    try {
      for(let i = 0; i < requests.length; i++)
        requests[i] = formatRelation(requests[i]);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_RELATIONS"));
    }

    return resolve(requests);
  });
};

module.exports = getFollowRequests;