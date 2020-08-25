const Post = require("../models/Post");

const userHasViewPermission = (user, post) => {

  // user: the session user
  // post: the post the user is accessing

  let permission = post.poster._id.equals(user._id); // the poster is accessing post

  if(!permission) {
    for(let i = 0; i < post.poster.followers.length; i++) {
      // the current user follows the poster and the relation was accepted
      if((post.poster.followers[i].user.equals(user._id) && post.poster.followers[i].accepted) || post.poster.profile_privacy_type == "public") {
        permission = true;
        break;
      }
    }
  }

  return permission;
};

module.exports = userHasViewPermission;