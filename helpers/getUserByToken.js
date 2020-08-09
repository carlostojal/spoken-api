const User = require("../models/User");

const getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ "access_token.value": token }).then((result) => {
      if(result) {
        if(parseInt(result.access_token.expiry) > Date.now()) // token is not expired
          resolve(result);
      }
      resolve(null);
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = getUserByToken;
