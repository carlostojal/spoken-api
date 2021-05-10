const Session = require("../db_models/Session");
const User = require("../db_models/User");

const getNearbyUsers = (current_lat, current_long, max_distance, user) => {
  return new Promise(async (resolve, reject) => {

    let sessions = null;
    try {
      sessions = await Session.find({user_location: {$near: {
        $maxDistance: max_distance,
        $geometry: {
          type: "Point",
          coordinates: [current_lat, current_long]
        }
      }}})
        .populate("user")
        .populate("user.profile_pic");
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_SESSIONS"));
    }

    let users = [];

    sessions.map((session) => {
      if(!users.includes(session.user))
        users.push(session.user);
    });

    return resolve(users);

  });
};

module.exports = getNearbyUsers;