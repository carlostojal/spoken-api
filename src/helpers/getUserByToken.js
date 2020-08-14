const User = require("../models/User");

const getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ "access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() } }).then((result) => {
      if(result) {
        resolve(result);
      }
      resolve(null);
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = getUserByToken;
