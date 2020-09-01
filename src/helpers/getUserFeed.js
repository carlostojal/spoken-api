const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const Post = require("../models/Post");
const mediaIdToUrl = require("./mediaIdToUrl");
const userReacted = require("./userReacted");

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

const getUserFeed = (page, perPage, user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // get all posts which poster ID is in the current user following array
    User.populate(user, "following").then((user) => {

      // get the user following IDs
      let followingArray = [];
      user.following.map((relation) => {
        if(relation.accepted)
          followingArray.push(relation.follows);
      });
      followingArray.push(user._id); // add session user ID

      const query = Post.find({ poster: { $in: followingArray }});
      query.populate("poster", "_id name surname username profile_pic_media");
      query.populate({
        path: "reactions",
        populate: {
          path: "user"
        }
      });
      query.populate({
        path: "comments",
        populate: {
          path: "user"
        }
      });
      query.limit(perPage);
      query.skip(perPage * (page - 1));
      query.sort({time: -1});
      query.exec((error, posts) => {
        if (error) return reject(error);
        posts.map((post) => {
          // post has media
          if(post.media)
            post.media_url = mediaIdToUrl(post.media);

          if(post.poster.profile_pic_media)
            post.poster.profile_pic_url = mediaIdToUrl(post.poster.profile_pic_media);
          
          post.user_reacted = userReacted(user, post);
        });
        console.log(`${user.username} got feed.`);
        resolve(posts);
      });
    }).catch((e) => {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    });
  });
};

module.exports = getUserFeed;