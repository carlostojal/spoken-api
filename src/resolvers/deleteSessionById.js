const { AuthenticationError } = require("apollo-server");
const Session = require("../db_models/Session");

const deleteSessionById = (session_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let session = null;
    try {
      session = await Session.findByIdAndRemove(session_id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_DELETING_SESSION"));
    }

    return resolve(session);

  });
};

module.exports = deleteSessionById;