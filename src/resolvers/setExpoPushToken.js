const { AuthenticationError } = require("apollo-server");

const setPushToken = require("../helpers/controllers/users/setPushToken");

const setExpoPushToken = (token, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
      
    try {
      await setPushToken(user.id, token, mysqlPool);
    } catch(e) {
      return reject(e);
    }

    return resolve(true);
  });
};

module.exports = setExpoPushToken;