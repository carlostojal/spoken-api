const { AuthenticationError } = require("apollo-server");
const Media = require("../db_models/Media");
const User = require("../db_models/User");

const getUserMedia = async (user_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  let target_user = user_id ? user_id : user._id;

  let user_data = null;
  try {
    user_data = await User.findById(target_user);
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_USER");
  }

  if(user_data.profile_privacy_type == "private" && !user_data._id.equals(user._id))
    return [];
  
  let media = null;
  try {
    media = await Media.find({user: target_user, type: "image"}).sort("-time");
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_MEDIA");
  }

  return media;
};

module.exports = getUserMedia;