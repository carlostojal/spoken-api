const { AuthorizationError } = require("apollo-server");
const getSessionsController = require("../helpers/controllers/sessions/getSessions");

const getSessions = (user, redisClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthorizationError("BAD_AUTHENTICATION"));

    let sessions = null;
    try {
      sessions = await getSessionsController(user.id, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSIONS"));
    }

    return resolve(sessions);

  });
};

module.exports = getSessions;
