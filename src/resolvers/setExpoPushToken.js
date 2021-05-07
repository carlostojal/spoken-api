const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const setExpoPushToken = (token, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));
      
    let cur_user = null;
    try {
      cur_user = await User.findById(user._id);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    try {
      user.push_token = token;
      await user.save();
    } catch(e) {
      return reject(new Error("ERROR_UPDATING_TOKEN"));
    }

    return resolve(true);
  });
};

module.exports = setExpoPushToken;