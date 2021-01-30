const { AuthenticationError } = require("apollo-server");
const acceptRelation = require("../helpers/controllers/relations/acceptRelation");
const getUserById = require("../helpers/controllers/users/getUserById");

const acceptFollowRequest = (user_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1 = null;
    try {
      user1 = await getUserById(user_id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user1)
      return reject("USER_NOT_FOUND");

    try {
      await acceptRelation(user_id, user.id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_ACCEPTING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = acceptFollowRequest;