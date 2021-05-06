const { AuthenticationError } = require("apollo-server");
const captureViewController = require("../helpers/controllers/analytics/capturePostView");

const capturePostView = (post_id, user_lat, user_long, user_os, view_time, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user) 
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

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
      await captureViewController(user.id, post_id, user_lat, user_long, user_os, view_time, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CAPTURING_DATA"));
    }

    return resolve(true);
  });
};

module.exports = capturePostView;