const { AuthenticationError } = require("apollo-server");
const acceptRelation = require("../helpers/controllers/relations/acceptRelation");
const getUserById = require("../helpers/controllers/users/getUserById");

const acceptFollowRequest = (user_id, user) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../config/mysql");
    } catch(e) {
      return reject(e);
    }

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1 = null;
    try {
      user1 = await getUserById(user_id);
    } catch(e) {
      
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user1)
      return reject("USER_NOT_FOUND");

    try {
      await acceptRelation(user_id, user.id);
    } catch(e) {
      
      return reject(new Error("ERROR_ACCEPTING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = acceptFollowRequest;