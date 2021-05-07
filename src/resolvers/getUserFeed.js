const { AuthenticationError } = require("apollo-server");
const getFeed = require("../helpers/controllers/posts/getFeed");
const getFeedFromCache = require("../helpers/controllers/posts/getFeedFromCache");
const saveFeedToCache = require("../helpers/controllers/posts/saveFeedToCache");
const savePostToCache = require("../helpers/controllers/posts/savePostToCache");

const getUserFeed = (user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts;
    try {
      posts = await getFeedFromCache(page, user.id);
      if(!posts) {
        posts = await getFeed(page, perPage, user.id);
        try {
          for(let i = 0; i < posts.length; i++)
            savePostToCache(posts[i]);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_FORMATTING_POSTS"));
        }
        saveFeedToCache(page, user.id, posts);
      }
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_FEED"));
    }

    return resolve(posts);
  });
};

module.exports = getUserFeed;