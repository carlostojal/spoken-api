const { AuthenticationError } = require("apollo-server");
const deleteSessionByIdController = require("../helpers/controllers/sessions/deleteSessionById");

const deleteSessionById = (session_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    try {
      await deleteSessionByIdController(session_id, user.id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_DELETING_SESSION"));
    }

    return resolve(null);

  });
};

module.exports = deleteSessionById;