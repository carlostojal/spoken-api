const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const userSearch = async (query, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  if(query == "")
    return [];

  let users = [];
  try {
    users = await User.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" }}
    ).sort({ score: { $meta: "textScore" } });
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USERS");
  }

  return users;

};

module.exports = userSearch;
