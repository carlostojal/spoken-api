const { AuthenticationError } = require("apollo-server");

const setPushToken = require("../helpers/controllers/users/setPushToken");

const setExpoPushToken = (token, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
      
    try {
      await setPushToken(user.id, token);
    } catch(e) {
      return reject(new Error("ERROR_SETTING_TOKEN"));
    }

    return resolve(true);
  });
};

module.exports = setExpoPushToken;