const User = require("../models/User");

const getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    User.findOne({ access_token: { value: token } }).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
}
