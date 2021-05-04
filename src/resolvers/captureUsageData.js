const { AuthenticationError } = require("apollo-server");

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
  });
};

module.exports = captureUsageData;