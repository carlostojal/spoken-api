const { AuthenticationError } = require("apollo-server");
const generateId = require("../helpers/generateId");
const insertPost = require("../helpers/controllers/posts/insertPost");
const getPostById = require("../helpers/controllers/posts/getPostById");
const associateMediaWithPost = require("../helpers/controllers/posts/associateMediaWithPost");
const cache = require("../helpers/cache/cache");
const formatPost = require("../helpers/formatPost");
const checkPostToxicity = require("../helpers/checkPostToxicity");

/*
*
* Promise createPost(text, media_id, user)
*
* Summary:
*   The createPost function takes post text,
*   media ID (optional) and the session user object
*   to create a new post.
*
* Parameters:
*   String: text
*   String: media_id
*   Object: user
*
* Return Value:
*   Promise: 
*     Object: user
*
* Description:
*   This function takes post text, media ID and the 
*   the session user object.
*   The media ID is optional and represents the ID 
*   of the document that refers to a media (image/video) 
*   relative path.
*   The post object is then saved to the database and
*   added to the user posts array.
*   After this the created post is returned.
*   
*/

const createPost = (text, media_id, user, redisClient, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const post = {
      id: generateId(),
      user_id: user.id,
      time: Date.now(),
      text: text
    };

    // insert simple post
    try {
      await insertPost(post, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // associate the media ID with the post
    if(media_id) {
      try {
        await associateMediaWithPost(post.id, media_id, mysqlClient);
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_ASSOCIATING_MEDIA"));
      }
    }

    // get the post from the database
    let post1 = null;
    try {
      post1 = await getPostById(post.id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // format post to be like in the expected form from GraphQL typedefs
    try {
      post1 = formatPost(post1);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if the post text is toxic (the user will not wait for this action)
    checkPostToxicity(post, mysqlClient);

    // save in cache
    try {
      await cache(`post-${post.id}`, null, JSON.stringify(post1), process.env.POST_CACHE_DURATION, true, true, redisClient);
    } catch(e) {
      console.error(e);
    }

    return resolve(post1);
  });
}

module.exports = createPost;