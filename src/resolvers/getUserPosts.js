const { AuthenticationError } = require("apollo-server");

const userFollowsUser = require("../helpers/controllers/users/userFollowsUser");
const getPosts = require("../helpers/controllers/posts/getUserPosts");
const formatPost = require("../helpers/formatPost");

const getUserPosts = (page, perPage, user_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let follows = false;
    try {
      follows = await userFollowsUser(user.id, user_id);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_PERMISSION"));
    }

    if(!follows)
      return reject(new Error("NOT_ALLOWED"));

    let posts;
    try {
      posts = await getPosts(page, perPage, user_id);
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