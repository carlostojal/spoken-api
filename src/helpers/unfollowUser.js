const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const FollowRelation = require("../models/FollowRelation");

const unfollowUser = (id, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      reject(new AuthenticationError("Bad authentication"));

    FollowRelation.findOne({ user: context.user._id, follows: id }).then((followRelation) => {

      if(!followRelation)
        return reject(new Error("Relation not existent"));

      // find user that will be unfollowed
      User.findOne({ _id: id }).then((user) => {

        if(!user)
          reject(new Error("User doesn't exist."));
        
        // remove follow relation from followers array
        for(let i = 0; i < user.followers.length; i++) {
          if(user.followers[i]._id == followRelation._id) {
            user.followers.splice(i, 1);
            i--;
          }
        }

        user.save().then(() => {

          // find current session user
          User.findOne({ _id: context.user._id }).then((currentUser) => {

            for(let i = 0; i < currentUser.following.length; i++) {
              if(currentUser.following[i]._id == followRelation._id) {
                user.followers.splice(i, 1);
                i--;
              }
            }

            currentUser.save().then(() => {
              // resolve with the unfollowed user
              FollowRelation.deleteOne({ user: context.user._id, follows: id }).then(() => {
                console.log("User unfollowed.");
                resolve(user);
              }).catch((error) => {
                reject(error);
              });
            }).catch((error) => {
              reject(error);
            })

          }).catch((error) => {
            reject(error);
          });

        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
    });
};

module.exports = unfollowUser;