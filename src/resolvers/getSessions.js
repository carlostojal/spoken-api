const { AuthenticationError } = require("apollo-server");
const Session = require("../db_models/Session");

const getSessions = (user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let sessions = [];
    try {
      sessions = await Session.find({user: user._id});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSIONS"));
    }

    return resolve(sessions);

  });
};

module.exports = getSessions;
