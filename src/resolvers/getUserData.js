const { AuthenticationError } = require("apollo-server");
const getUserById = require("../helpers/controllers/users/getUserById");
const getUserFromCache = require("../helpers/controllers/users/getUserFromCache");
const mediaIdToUrl = require("../helpers/media/mediaIdToUrl");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");

const getUserData = (id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    // function to remove private user data and return
    const clearAndReturnUser = (resUser) => {

      // get profile pic url from media ID
      if(resUser.profile_pic_media)
          resUser.profile_pic_url = mediaIdToUrl(resUser.profile_pic_media);

      // remove email for privacy reasons
      if(id && user.id != id)
        resUser.email = null;

      return resolve(resUser);
    }


    if(!user) return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!id)
      id = user.id;

    let returnUser = null;

    try {
      returnUser = await getUserFromCache(id);
      if(!returnUser)
        returnUser = await getUserById(id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    try {
      returnUser.is_followed = await userFollowsUser(user.id, id, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_RELATION"));
    }

    returnUser.is_himself = !id || id == user.id;

    clearAndReturnUser(returnUser);
  });
}

module.exports = getUserData;