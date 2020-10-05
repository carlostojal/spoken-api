const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../models/FollowRelation");
const Post = require("../models/Post");
const mediaIdToUrl = require("../helpers/media/mediaIdToUrl");
const userReacted = require("../helpers/posts/userReacted");
const getFromCache = require("../helpers/cache/getFromCache");
const getFeed = require("../helpers/controllers/posts/getFeed");
const cache = require("../helpers/cache/cache");
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

const getUserFeed = (page, perPage, user, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts;
    try {
      posts = await getFeed(page, perPage, user.id, mysqlClient);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_FEED"));
    }

    try {
      for(let i = 0; i < posts.length; i++)
        posts[i] = formatPost(posts[i]);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FORMATING_POSTS"));
    }

    console.log(posts);

    return resolve(posts);
  });
};

module.exports = getUserFeed;