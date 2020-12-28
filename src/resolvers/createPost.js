const { AuthenticationError } = require("apollo-server");
const generateId = require("../helpers/generateId");
const insertPost = require("../helpers/controllers/posts/insertPost");
const getPostById = require("../helpers/controllers/posts/getPostById");
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

const createPost = (text, media_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const post = {
      id: generateId(),
      user_id: user.id,
      time: Date.now(),
      text,
      media_id
    };

    // insert simple post
    try {
      await insertPost(post);
    } catch(e) {
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // get the post from the database
    let post1 = null;
    try {
      post1 = await getPostById(post.id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // format post to be like in the expected form from GraphQL typedefs
    try {
      post1 = formatPost(post1);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if the post text is toxic (the user will not wait for this action)
    checkPostToxicity(post);

    return resolve(post1);
  });
}

module.exports = createPost;