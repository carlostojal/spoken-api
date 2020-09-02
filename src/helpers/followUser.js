const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const FollowRelation = require("../models/FollowRelation");

/*
*
* Promise followUser(id, user)
*
* Summary:
*   The followUser function user ID and the session
*   user object.
*   Creates / removes the follow relation.
*
* Parameters:
*   String: id
*   Object: user
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   This function takes the user ID of the followed user
*   and the session user object.
*   Tries to create the relation. If it already exists,
*   removes it (unfollow).
*   The followed user array is returned.
*   
*/

const followUser = (id, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    if(!id)
      reject(new Error("NO_USER_ID_PROVIDED"));

    if(id == user._id)
      reject(new Error("USER_FOLLOWING_HIMSELF"));

    // find user from provided ID
    User.findById(id).then((user1) => {

      if(!user1)
        reject(new Error("USER_DOESNT_EXIST"));

      const accepted = user1.profile_privacy_type == "public";
        
      // create follow relation
      const followRelation = new FollowRelation({
        user: user._id,
        follows: id,
        accepted
      });

      followRelation.save().then(() => {
        console.log(`${user.username} followed ${user1.username}.`);
        return resolve(user1);
      }).catch((error) => {
        // the relation already exists, so remove
        if(error.code == 11000) {
          FollowRelation.deleteOne({ user: user._id, follows: user1._id }).then(() => {
            console.log(`${user.username} unfollowed ${user1.username}.`);
            return resolve(user1);
          }).catch((error) => {
            console.error(error);
            return reject(new Error("ERROR_REMOVING_RELATION"));
          });
        } else {
          console.error(error);
          return reject(new Error("ERROR_CREATING_RELATION"));
        }
      });
    }).catch((error) => {
      console.error(error);
      return reject(new Error("ERROR_FINDING_USER"));
    });
  });
};

module.exports = followUser;