const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const userSearch = async (query, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  if(query == "")
    return [];

  const regex = new RegExp(query);

  let users = [];
  try {
    users = User.find({$or: [
      {username: {$regex: regex, $options: "i"}},
      {name: {$regex: regex, $options: "i"}},
      {surname: {$regex: regex, $options: "i"}}
    ]});
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USERS");
  }

  return users;

};

module.exports = userSearch;
