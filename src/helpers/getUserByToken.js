const getFromCache = require("./getFromCache");

const getUserByToken = (token, redisClient) => {
  return new Promise((resolve, reject) => {

    getFromCache("access-tokens", token, redisClient).then((user) => {
      return resolve(user[0] ? JSON.parse(user[0]) : null);
    }).catch((e) => {
      console.log(e);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getUserByToken;
