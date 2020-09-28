const { AuthenticationError } = require("apollo-server");
const acceptRelation = require("../helpers/controllers/relations/acceptRelation");
const getUserById = require("../helpers/controllers/users/getUserById");
const FollowRelation = require("../models/FollowRelation");

/*
*
* Promise acceptFollowRequest(user_id, user)
*
* Summary:
*   The acceptFollowRequest function accepts the 
*   follow request from the user with the provided ID.
*
* Parameters:
*   String: user_id
*   Object: user
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   This function takes the user ID of the user following
*   the session user.
*   After this the accepted user object is returned.
*   
*/

const acceptFollowRequest = (user_id, user, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let user1 = null;
    try {
      user1 = await getUserById(user_id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user1)
      return reject("USER_NOT_FOUND");

    try {
      await acceptRelation(user_id, user.id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_ACCEPTING_RELATION"));
    }

    return resolve(user1);
  });
};

module.exports = acceptFollowRequest;