const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const mediaIdToUrl = require("../helpers/media/mediaIdToUrl");
const cache = require("../helpers/cache/cache");

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

const getUserData = (id, user, redisClient) => {
  return new Promise((resolve, reject) => {

    // function to remove private user data and return
    const clearAndReturnUser = (resUser) => {

      // get profile pic url from media ID
      if(resUser.profile_pic_media)
          resUser.profile_pic_url = mediaIdToUrl(resUser.profile_pic_media);

      /*
      // get number of relations
      user.n_following = user.following.length;
      user.n_followers = user.followers.length;*/

      // remove email for privacy reasons
      if(id && user._id.toString() != id)
        resUser.email = null;

      return resolve(resUser);
    }


    if(!user) return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!id)
      id = user._id;          

    // try to get from cache
    redisClient.get(`userdata-uid-${id}`, (error, result) => {

      if (error) {
        console.error(error);
        return reject(new Error("ERROR_ACCESSING_CACHE"));
      }

      if(result) {
        console.log("Get user data from cache.");
        return clearAndReturnUser(JSON.parse(result));
      }

      const query = User.findOne({ _id: id });
      query.exec((err, query_user) => {
        
        if (err) return reject(new Error("ERROR_GETTING_USER"));

        if (!query_user) return reject(new Error("USER_NOT_EXISTENT"));

        // save the data got to cache
        cache(`userdata-uid-${query_user._id}`, null, JSON.stringify(query_user), process.env.USER_DATA_CACHE_DURATION, true, false, redisClient).then(() => {
          console.log("User data saved to cache.");
        }).catch((e) => {
          console.log(e);
        });

        console.log("Get user data from DB.");

        return clearAndReturnUser(query_user);
      });
    });
  });
}

module.exports = getUserData;