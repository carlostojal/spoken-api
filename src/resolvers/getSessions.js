const { AuthenticationError } = require("apollo-server");
const Session = require("../db_models/Session");

const getSessions = async (user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let sessions = [];
  try {
    sessions = await Session.find({user: user._id});
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_SESSIONS");
  }

  return sessions;
};

module.exports = getSessions;
