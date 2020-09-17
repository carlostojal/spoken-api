const jwt = require("jsonwebtoken");
const getFromCache = require("./getFromCache");

const getUserByToken = (token, redisClient) => {
  return new Promise((resolve, reject) => {

    let decoded = null;

    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_VERIFYING_TOKEN"));
    }

    if(!decoded)
      return reject(new Error("INVALID_TOKEN"));

    getFromCache(`user-token-${token}`, null, redisClient).then((user) => {
      return resolve(JSON.parse(user));
    }).catch((e) => {
      console.log(e);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
}

module.exports = getUserByToken;
