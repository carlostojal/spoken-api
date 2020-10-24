const { AuthenticationError } = require("apollo-server");
const getFeed = require("../helpers/controllers/posts/getFeed");
const getFeedFromCache = require("../helpers/controllers/posts/getFeedFromCache");
const getPostById = require("../helpers/controllers/posts/getPostById");
const getPostFromCache = require("../helpers/controllers/posts/getPostFromCache");
const formatPost = require("../helpers/formatPost");

/*
*
* Promise getUserFeed(page, perPage, user)
*
* Summary:
*   The getUserFeed function returns an array
*   of posts for the user feed with pagination.
*
* Parameters:
*   Number: page
*   Number: perPage
*   Object: user
*
* Return Value:
*   Promise: 
*     Array of Objects
*
* Description:
*   This function receives a page number and number 
*   of posts to return per page. Returns an array
*   of posts from the users who the session
*   follows ordered by the post date.
*   
*/

const getUserFeed = (page, perPage, user, mysqlClient, redisClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts;
    try {
      posts = await getFeedFromCache(page, user.id, redisClient);
      if(posts && posts.length > 0) {
        for(let i = 0; i < posts.length; i++) {
          let post_id = posts[i];
          posts[i] = await getPostFromCache(post_id, redisClient);
          if(!posts[i])
            posts[i] = await getPostById(post_id, mysqlClient, redisClient);
        }
      } else {
        posts = await getFeed(page, perPage, user.id, mysqlClient, redisClient);
      }
    } catch(e) {
      return reject(new Error("ERROR_GETTING_FEED"));
    }

    try {
      for(let i = 0; i < posts.length; i++)
        posts[i] = formatPost(posts[i]);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POSTS"));
    }

    return resolve(posts);
  });
};

module.exports = getUserFeed;