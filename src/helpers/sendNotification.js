const { Expo } = require("expo-server-sdk");
const User = require("../db_models/User");

const sendNotification = (title, body, user_id) => {
  return new Promise(async (resolve, reject) => {

    let user = null;
    try {
      user = await User.findById(user_id);
    } catch(e) {
      console.error(e);
      return reject(e);
    }

    if(user.push_token) {

      if(!Expo.isExpoPushToken(user.push_token))
        return reject(new Error("INVALID_PUSH_TOKEN"));

      const expo = new Expo();

      let messages = [{
        to: user.push_token,
        title,
        body
      }];

      try {
        await expo.sendPushNotificationsAsync(messages);
      } catch(e) {
        console.error(e);
        return reject(e);
      }
    }
  
    return resolve(null);

  });
};

module.exports = sendNotification;