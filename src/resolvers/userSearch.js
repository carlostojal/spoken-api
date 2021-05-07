const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const userSearch = (query, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const regex = new RegExp(`/${query}/`);

    let users = [];
    try {
      users = User.find({$or: [
        {username: {$regex: regex, $options: "i"}},
        {name: {$regex: regex, $options: "i"}},
        {surname: {$regex: regex, $options: "i"}}
      ]});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USERS"));
    }

    return resolve(users);

  });
};

module.exports = userSearch;
