const User = require("../models/User");

const getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ "email_confirmed": true,"access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() } }).then((result) => {
      if(result)
        return resolve(result);
      return resolve(null);
    }).catch((err) => {
      return reject(err);
    });
  });
}

module.exports = getUserByToken;
