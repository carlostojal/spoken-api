const { AuthenticationError } = require("apollo-server");
const Media = require("../db_models/Media");

const getUserMedia = (user_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let target_user = user_id ? user_id : user._id;
    
    let media = null;
    try {
      media = await Media.find({user: target_user, type: "image"});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_MEDIA"));
    }

    return resolve(media);
    
  });
};

module.exports = getUserMedia;