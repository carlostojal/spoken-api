const { AuthenticationError } = require("apollo-server");
const Post = require("../models/Post");

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

const createPost = (text, media_id, original_post, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const post = new Post({ // create post
      poster: user._id,
      time: Date.now().toString(),
      text: text,
      media: media_id || null,
      original_post: original_post || null,
      edited: false
    });

    post.save().then((post) => { // save post
      Post.populate(post, "poster").then((post) => {
        console.log(`${user.username} created post.`);
        return resolve(post);
      }).catch((e) => {
        console.error(e);
        return reject(new Error("ERROR_GETTING_POST"));
      });
    }).catch((err) => {
      console.error(err);
      return reject(new Error("ERROR_SAVING_POST"));
    });
  });
}

module.exports = createPost;