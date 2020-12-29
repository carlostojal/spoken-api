const { Expo } = require("expo-server-sdk");

const sendNotification = (title, body, user_id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("SELECT push_token FROM Users WHERE id = ?", [user_id], async (err, result) => {

      if(err)
        return reject(err);

      console.log(result);

      result = JSON.parse(JSON.stringify(result));

      if(result.push_token) {

        const expo = new Expo();

        let messages = [{
          to: result.push_token,
          title,
          body
        }];

        const chunk = expo.chunkPushNotifications(messages);

        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch(e) {
          return reject(e);
        }
      }

      return resolve(null);
    });

  });
};

module.exports = sendNotification;