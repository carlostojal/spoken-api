const { AuthenticationError } = require("apollo-server");
const captureDataController = require("../helpers/controllers/analytics/captureUsageData");

const captureUsageData = (post_id, user_lat, user_long, user_os, view_time, user, mysqlPool) => {
  return new Promise((resolve, reject) => {

    if(!user) 
      return new AuthenticationError("BAD_AUTHENTICATION");

    /*
      Usage data:

      - user_id
      - post_id
      - user_lat
      - user_long
      - user_os
      - view_time
      
    */

    try {
      // will not await because data collection is not critical to make the user wait for it
      captureDataController(user.id, post_id, user_lat, user_long, user_os, view_time, mysqlPool);
    } catch(e) {
      return reject(new Error("ERROR_CAPTURING_DATA"));
    }

    return resolve(null)
  });
};

module.exports = captureUsageData;