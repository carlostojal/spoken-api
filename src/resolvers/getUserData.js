const { AuthenticationError } = require("apollo-server");
const getUserById = require("../helpers/controllers/users/getUserById");
const getUserFromCache = require("../helpers/controllers/users/getUserFromCache");
const mediaIdToUrl = require("../helpers/media/mediaIdToUrl");

/*
*
* Promise getUserData(id, user)
*
* Summary:
*   The getUserData function receives an user ID
*   and the session user object. 
*   Returns the data of the user with the provided
*   ID (if provided), else returns the current user
*   data.
*
* Parameters:
*   String (optional): id
*   Object: user
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   In case of a user ID being provided that user data
*   is get from the database and returned.
*   Else the session user data is returned immediately.
*   
*/

const getUserData = (id, user, mysqlClient, redisClient) => {
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
      returnUser = await getUserFromCache(id, redisClient);
      if(!returnUser)
        returnUser = await getUserById(id, mysqlClient, redisClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_USER"));
    }

    clearAndReturnUser(returnUser);
  });
}

module.exports = getUserData;