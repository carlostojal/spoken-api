const { Expo } = require("expo-server-sdk");

const sendNotification = (title, body, user_id) => {
  return new Promise(async (resolve, reject) => {

    console.log("sending follow notification");

    let mysqlClient;
    try {
      mysqlClient = await require("../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("SELECT push_token FROM Users WHERE id = ?", [user_id], async (err, result) => {

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
};

module.exports = sendNotification;