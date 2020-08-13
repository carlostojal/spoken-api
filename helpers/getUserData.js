const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");

const getUserData = (id, context) => {
  return new Promise((resolve, reject) => {

    const checkRelation = (relation) => {
      return relation.accepted;
    }

    if(context.user) { 
      if(id) {
        
        const query = User.findOne({ _id: id });
        query.populate("posts");
        query.populate({
          path: "followers",
          populate: {
            path: "user"
          }
        });
        query.exec((err, user) => {
          
          if (err) reject(err);

          let userIsFollowing = false;

          for(let i = 0; i < user.followers.length; i++) {
            // the current user is in the requested user followers array and the follow request was accepted
            if(user.followers[i].user._id.equals(context.user._id) && user.followers[i].accepted) {
              userIsFollowing = true;
            }
          }

          // only send to frontend the following and follower array of accepted relations
          user.following = user.following.filter(checkRelation);
          user.followers = user.followers.filter(checkRelation);

          user.n_following = user.following.length;
          user.n_followers = user.followers.length;

          user.email = null;

          // if the user is not following, don't provide private information
          if(!userIsFollowing)
            user.posts = [];

          console.log("Got user data");
          resolve(user);
        });

      } else {
        const query = User.findOne({ _id: context.user._id});
        query.populate("posts");
        query.populate("following");
        query.populate("followers");
        query.exec((err, user) => {

          if (err) reject(err);

          // only send to frontend the following and follower array of accepted relations
          user.following = user.following.filter(checkRelation);
          user.followers = user.followers.filter(checkRelation);

          user.n_following = user.following.length;
          user.n_followers = user.followers.length;

          console.log("Got user data");
          resolve(user);

        });
      }
    } else {
      reject(new AuthenticationError("Bad authentication."));
    }
  });
}

module.exports = getUserData;