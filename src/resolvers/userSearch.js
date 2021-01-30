const { AuthenticationError } = require("apollo-server");
const searchUser = require("../helpers/controllers/users/searchUser");

const userSearch = (query, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let users = null;
    try {
      users = await searchUser(query, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_USERS"));
    }

    return resolve(users);

  });
};

module.exports = userSearch;
