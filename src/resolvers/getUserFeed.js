const { AuthenticationError } = require("apollo-server");
const getFeed = require("../helpers/controllers/posts/getFeed");
const getFeedFromCache = require("../helpers/controllers/posts/getFeedFromCache");
const saveFeedToCache = require("../helpers/controllers/posts/saveFeedToCache");
const savePostToCache = require("../helpers/controllers/posts/savePostToCache");

const getUserFeed = async (user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

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
        throw new Error("ERROR_FORMATTING_POSTS");
      }
      saveFeedToCache(user.id, posts);
    }
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_GETTING_FEED");
  }

  return posts;
};

module.exports = getUserFeed;