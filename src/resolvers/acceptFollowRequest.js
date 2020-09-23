const { AuthenticationError } = require("apollo-server");
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

const acceptFollowRequest = (user_id, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const query = FollowRelation.findOne({ user: user_id, follows: user._id });
    query.populate("user");
    query.exec((error, relation) => {

      if(error) {
        console.error(error);
        return reject(new Error("ERROR_FINDING_RELATION"));
      }
      
      if(!relation)
        return reject(new Error("NO_RELATION"));

      relation.accepted = true;

      relation.save().then(() => {
        FollowRelation.populate(relation, "user").then((relation) => {
          console.log(`${user.username} accepted ${relation.user.username} follow request.`);
          return resolve(relation.user);
        }).catch((error) => {
          console.error(error);
          return reject(new Error("ERROR_GETTING_USER"));
        });
      }).catch((error) => {
        console.error(error);
        return reject(new Error("ERROR_SAVING_RELATION"));
      });
    });
  });
};

module.exports = acceptFollowRequest;