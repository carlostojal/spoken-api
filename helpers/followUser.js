const User = require("../models/User");
const FollowRelation = require("../models/FollowRelation");

const followUser = (id, context) => {
  return new Promise((resolve, reject) => {

    if(!context.user)
      reject(new AuthenticationError("Bad authentication"));

    if(!id)
      reject(new Error("No user ID provided"));

    if(id == context.user._id)
      reject(new Error("User can't follow himself"));

    // find user from provided ID
    User.findOne({ _id: id }).then((user) => {

      if(!user)
        reject(new Error("User doesn't exist."));

      const accepted = user.profile_type == "public";

      User.findOne({ _id: context.user._id }).then((currentUser) => {
        
        // create follow relation
        const followRelation = new FollowRelation({
          user: context.user._id,
          follows: id,
          accepted
        });

        followRelation.save().then((result) => {
          // add follow relation to the current user following array
          currentUser.following.push(result._id);
          currentUser.save().then(() => {
            // add follow relation to the other user followers array
            user.followers.push(result._id);
            user.save().then(() => {
              console.log("User followed");
              resolve(user);
            }).catch((error) => {
              reject(error);
            })
          }).catch((error) => {
            reject(error);
          });
          resolve(user);
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

module.exports = followUser;