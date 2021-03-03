const { AuthenticationError } = require("apollo-server");
const getSessionsController = require("../helpers/controllers/sessions/getSessions");

const getSessions = (user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let sessions = null;
    try {
      sessions = await getSessionsController(user.id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSIONS"));
    }

    return resolve(sessions);

  });
};

module.exports = getSessions;
