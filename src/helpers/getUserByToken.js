const getFromCache = require("./getFromCache");

const getUserByToken = (token, redisClient) => {
  return new Promise((resolve, reject) => {

    getFromCache(`user-token-${token}`, null, redisClient).then((user) => {
      return resolve(JSON.parse(user));
    }).catch((e) => {
      console.log(e);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getUserByToken;
