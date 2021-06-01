const Session = require("../db_models/Session");
const User = require("../db_models/User");

const getNearbyUsers = async (current_lat, current_long, max_distance, user) => {

  if(max_distance > process.env.MAX_NEARBY_QUERY_DISTANCE)
    throw new Error("RANGE_TOO_BIG");

  let sessions = null;
  try {
    sessions = await Session.find({$and: [{
      user_location: {
        $near: {
            $maxDistance: max_distance,
            $geometry: {
              type: "Point",
              coordinates: [current_long, current_lat]
            }
        }
      }
    },
    {last_refresh: {$gte: Date.now() - (process.env.ACTIVE_USER_SESSION_AGE * 60 * 1000)}}
    ]})
      .populate("user")
      .populate("user.profile_pic");
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_SESSIONS");
  }

  let users = [];

  sessions.map((session) => {
    if(!users.includes(session.user))
      users.push(session.user);
  });

  return users;
};

module.exports = getNearbyUsers;