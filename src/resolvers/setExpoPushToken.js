const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");

const setExpoPushToken = async (token, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");
    
  let cur_user = null;
  try {
    cur_user = await User.findById(user._id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  try {
    user.push_token = token;
    await user.save();
  } catch(e) {
    throw new Error("ERROR_UPDATING_TOKEN");
  }

  return true;
};

module.exports = setExpoPushToken;