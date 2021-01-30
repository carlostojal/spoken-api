const { AuthenticationError } = require("apollo-server");
const getFeed = require("../helpers/controllers/posts/getFeed");
const getFeedFromCache = require("../helpers/controllers/posts/getFeedFromCache");
const getPostById = require("../helpers/controllers/posts/getPostById");
const getPostFromCache = require("../helpers/controllers/posts/getPostFromCache");
const formatPost = require("../helpers/formatPost");

const getUserFeed = (page, perPage, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts;
    try {
      posts = await getFeedFromCache(page, user.id);
      if(posts && posts.length > 0) {
        for(let i = 0; i < posts.length; i++) {
          let post_id = posts[i];
          posts[i] = await getPostFromCache(post_id);
          if(!posts[i])
            posts[i] = await getPostById(post_id, mysqlPool);
        }
      } else {
        posts = await getFeed(page, perPage, user.id, mysqlPool);
      }
    } catch(e) {
      return reject(new Error("ERROR_GETTING_FEED"));
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

module.exports = getUserFeed;