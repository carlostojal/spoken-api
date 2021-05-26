const { AuthenticationError } = require("apollo-server");
const User = require("../db_models/User");
const Session = require("../db_models/Session");

const startDetox = async (user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let cur_user = null;
  try {
    cur_user = await User.findById(user._id);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  cur_user.doing_detox = true;

  try {
    await cur_user.save();
  } catch(e) {
    throw new Error("ERROR_SAVING_USER");
  }

  try {
    await Session.deleteMany({user: user._id});
  } catch(e) {
    throw new Error("ERROR_ENDING_SESSIONS");
  }

  return cur_user;
};

module.exports = startDetox;