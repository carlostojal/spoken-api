const { AuthenticationError } = require("apollo-server");
const getUserById = require("../helpers/controllers/users/getUserById");
const ignoreRelation = require("../helpers/controllers/relations/ignoreRelation");

const ignoreFollowRelation = (user_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if (!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1;
    try {
      user1 = await getUserById(user_id, mysqlPool);
    } catch (e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if (!user1)
      return reject(new Error("USER_NOT_FOUND"));

    try {
      await ignoreRelation(user_id, user.id, mysqlPool);
    } catch (e) {
      console.error(e);
      return reject(new Error("ERROR_IGNORING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = ignoreFollowRelation;