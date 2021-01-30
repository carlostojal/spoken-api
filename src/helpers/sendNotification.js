const { Expo } = require("expo-server-sdk");

const sendNotification = (title, body, user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    console.log("sending follow notification");

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);
      
      connection.query("SELECT push_token FROM Users WHERE id = ?", [user_id], async (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result))[0];
  
        if(result.push_token) {
  
          if(!Expo.isExpoPushToken(result.push_token))
            return reject(new Error("INVALID_PUSH_TOKEN"));
  
          const expo = new Expo();
  
          let messages = [{
            to: result.push_token,
            title,
            body
          }];
  
          try {
            await expo.sendPushNotificationsAsync(messages);
            console.log("notification sent");
          } catch(e) {
            return reject(e);
          }
        }
  
        return resolve(null);
      });
    });

    

  });
};

module.exports = sendNotification;