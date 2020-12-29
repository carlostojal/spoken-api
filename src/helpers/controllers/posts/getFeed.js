const addPostToCachePage = require("./addPostToCachePage");
const savePostToCache = require("./savePostToCache");

const getFeed = (page, perPage, user_id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT CurrentPost.id, CurrentPost.time, CurrentPost.text, CurrentPost.media_id, CurrentPost.edited, (SELECT COUNT(*) FROM PostReactions WHERE post_id = CurrentPost.id AND user_id = ?) AS user_reacted,
    CurrentPostUser.id AS poster_id, CurrentPostUser.name AS poster_name, CurrentPostUser.surname AS poster_surname, CurrentPostUser.username AS poster_username, CurrentPostUser.profile_pic_media_id,
    CurrentPostUserMedia.id AS poster_profile_pic_media_id, CurrentPostUserMedia.is_nsfw AS poster_is_nsfw, CurrentPostUserMedia.nsfw_cause AS poster_nsfw_cause,
    OriginalPost.id AS original_post_id, OriginalPost.time AS original_post_time, OriginalPost.text AS original_post_text,
    OriginalPostUser.id AS original_poster_id, OriginalPostUser.name AS original_poster_name, OriginalPostUser.surname AS original_poster_surname, OriginalPostUser.username AS original_poster_username,
    OriginalPostUserMedia.id AS original_poster_profile_pic_media_id, OriginalPostUserMedia.is_nsfw AS original_poster_is_nsfw, OriginalPostUserMedia.nsfw_cause AS original_poster_nsfw_cause,
    PostMedia.is_nsfw AS media_is_nsfw, PostMedia.nsfw_cause AS media_nsfw_cause,
    (SELECT COUNT(*) FROM PostReactions WHERE user_id = ? AND post_id = CurrentPost.id) AS user_reacted
    FROM Posts CurrentPost 
    INNER JOIN Users CurrentPostUser ON CurrentPost.user_id = CurrentPostUser.id
    LEFT JOIN Posts OriginalPost1 ON CurrentPost.original_post_id = OriginalPost1.id
    LEFT JOIN Users OriginalPostUser ON OriginalPost1.user_id = OriginalPostUser.id
    LEFT JOIN Posts OriginalPost ON CurrentPost.original_post_id = OriginalPost.id AND (
    ((SELECT COUNT(*) FROM FollowRelations WHERE FollowRelations.user = ? AND FollowRelations.follows = OriginalPostUser.id AND FollowRelations.accepted = 1) = 1) OR 
    OriginalPostUser.profile_privacy_type = "public")
    LEFT JOIN Media PostMedia ON CurrentPost.media_id = PostMedia.id
    LEFT JOIN Media CurrentPostUserMedia ON CurrentPostUser.profile_pic_media_id = CurrentPostUserMedia.id
    LEFT JOIN Media OriginalPostUserMedia ON OriginalPostUser.profile_pic_media_id = OriginalPostUserMedia.id
    INNER JOIN FollowRelations CurrentPostRelation ON CurrentPostRelation.user = ? AND CurrentPostRelation.follows = CurrentPostUser.id AND CurrentPostRelation.accepted = 1
    ORDER BY CurrentPost.time DESC
    LIMIT ? OFFSET ?`, [user_id, user_id, user_id, user_id, perPage, (page - 1) * perPage], async (err, result) => {

      if(err) {
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));

      /*
      result.map(async (post) => {
        await addPostToCachePage(post.id, user_id, page);
        await savePostToCache(post);
      });*/

      return resolve(result);
    });

  });
};

module.exports = getFeed;