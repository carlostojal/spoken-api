const { AuthenticationError } = require("apollo-server");
const FollowRelation = require("../models/FollowRelation");
const Post = require("../models/Post");
const mediaIdToUrl = require("./mediaIdToUrl");
const userReacted = require("./userReacted");
const getFromCache = require("./getFromCache");
const cache = require("./cache");

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

const getUserFeed = (page, perPage, user, redisClient) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    let posts;

    // try to get from cache
    try {
      posts = await getFromCache(`feed-uid-${user._id}`, `page-${page}`, redisClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_READING_CACHE"));
    }

    if(posts[0]) {
      console.log(`${user.username} got feed page from cache.`);
      return resolve(JSON.parse(posts[0]));
    }

    // not in cache. get from DB
    FollowRelation.find({ user: user._id }).then((relations) => {
      // get the user following IDs
      let followingArray = [];
      relations.map((relation) => {
        if(relation.accepted)
          followingArray.push(relation.follows);
      });
      followingArray.push(user._id); // add session user ID

      const query = Post.find({ poster: { $in: followingArray }});
      query.lean();
      query.populate("poster", "_id name surname username profile_pic_media");
      query.limit(perPage);
      query.skip(perPage * (page - 1));
      query.sort({time: -1});
      query.exec((error, posts) => {

        if (error) {
          console.error(error);
          return reject(new Error("ERROR_GETTING_FOLLOWERS"));
        }

        for(let i = 0; i < posts.length; i++) {

          let post_copy = {...posts[i]};

          // post has media
          if(post_copy.media)
            post_copy.media_url = mediaIdToUrl(post_copy.media);

          if(post_copy.poster.profile_pic_media)
            post_copy.poster.profile_pic_url = mediaIdToUrl(post_copy.poster.profile_pic_media);
          
          post_copy.user_reacted = userReacted(user, post_copy);

          posts[i] = post_copy;

        }

        cache(`feed-uid-${user._id}`, `page-${page}`, JSON.stringify(posts), process.env.USER_FEED_CACHE_DURATION, true, false, redisClient).then(() => {
          console.log("Feed set to cache.");
        }).catch((error) => {
          return reject(error);
        });

        console.log(`${user.username} got feed from DB.`);
        return resolve(posts);
      });
    }).catch((error) => {
      console.error(error);
      return reject(new Error("ERROR_GETTING_FOLLOWERS"));
    });
  });
};

module.exports = getUserFeed;