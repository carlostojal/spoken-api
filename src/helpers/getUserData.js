const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const mediaIdToUrl = require("./mediaIdToUrl");

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

const getUserData = (id, user) => {
  return new Promise((resolve, reject) => {

    // filter to check if the follow request was accepted
    const checkRelation = (relation) => {
      return relation.accepted;
    }

    // function to remove private user data and return
    const clearAndReturnUser = (user) => {
      // get profile pic url from media ID
      if(user.profile_pic_media)
          user.profile_pic_url = mediaIdToUrl(user.profile_pic_media);

      // only count the accepted relations
      user.following.filter(checkRelation);
      user.followers.filter(checkRelation);

      // get number of relations
      user.n_following = user.following.length;
      user.n_followers = user.followers.length;

      // clear for privacy and optimization reasons
      user.following = null;
      user.followers = null;

      // remove email for privacy reasons
      user.email = null;

      console.log("Get user data.");

      return resolve(user);
    }

    if(!user) return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(id) { // the user is querying an user from ID

      if(id == user._id) { // the requested ID is the session user ID
        return clearAndReturnUser(user);
      }

      const query = User.findOne({ _id: id });
      query.populate("following");
      query.populate("followers");
      query.exec((err, query_user) => {
        
        if (err) return reject(new Error("ERROR_GETTING_USER"));

        if (!query_user) return reject(new Error("USER_NOT_EXISTENT"));

        return clearAndReturnUser(query_user);
      });      
    } else { // the user is querying his own data
      return clearAndReturnUser(user);
    }
  });
}

module.exports = getUserData;