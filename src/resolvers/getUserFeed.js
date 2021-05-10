const { AuthenticationError } = require("apollo-server");
const getFeed = require("../helpers/controllers/posts/getFeed");
const getFeedFromCache = require("../helpers/controllers/posts/getFeedFromCache");
const saveFeedToCache = require("../helpers/controllers/posts/saveFeedToCache");
const savePostToCache = require("../helpers/controllers/posts/savePostToCache");

const getUserFeed = (user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts = null;
    try {
      // posts = await getFeedFromCache(user.id);
      if(!posts) {
        posts = await getFeed(user.id);
        try {
          for(let i = 0; i < posts.length; i++)
            savePostToCache(posts[i]);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_FORMATTING_POSTS"));
        }
        saveFeedToCache(user.id, posts);
      }
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_FEED"));
    }

    return resolve(posts);
  });
};

module.exports = getUserFeed;