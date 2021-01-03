const { AuthenticationError } = require("apollo-server");

const getUserById = require("../helpers/controllers/users/getUserById");
const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const getPosts = require("../helpers/controllers/posts/getUserPosts");
const formatPost = require("../helpers/formatPost");

const getUserPosts = (page, perPage, user_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // if a user id was provided
    if(user_id) {

      let user1;
      try {
        user1 = await getUserById(user_id);
      } catch(e) {
        return reject(new Error("ERROR_GETTING_USER"));
      }

      // if the account is private, check if the user follows
      if(user1.profile_privacy_type == "private") {

        let follows = false;
        try {
          follows = await userFollowsUser(user.id, user_id);
        } catch(e) {
          return reject(new Error("ERROR_CHECKING_PERMISSION"));
        }

        if(!follows)
          return reject(new Error("NOT_ALLOWED"));
      }
    }

    let posts;
    try {
      posts = await getPosts(page, perPage, user_id || user.id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POSTS"));
    }

    try {
      for(let i = 0; i < posts.length; i++)
        posts[i] = formatPost(posts[i]);
    } catch(e) {
      return reject(new Error("ERROR_FORMATTING_POSTS"));
    }

    return resolve(posts);

  });
};

module.exports = getUserPosts;