const { AuthenticationError } = require("apollo-server");
const Session = require("../db_models/Session");

const deleteSessionById = async (session_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let session = null;
  try {
    session = await Session.findByIdAndRemove(session_id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_DELETING_SESSION");
  }

  return session;
};

module.exports = deleteSessionById;