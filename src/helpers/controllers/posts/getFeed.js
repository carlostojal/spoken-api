
const getFeed = (page, perPage, user_id, mysqlClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`SELECT CurrentPost.id, CurrentPost.time, CurrentPost.text, CurrentPost.edited,
    CurrentPostUser.id AS poster_id, CurrentPostUser.name AS poster_name, CurrentPostUser.surname AS poster_surname, CurrentPostUser.username AS poster_username, CurrentPostUser.profile_pic_media_id,
    OriginalPost.id AS original_post_id, OriginalPost.time AS original_post_time, OriginalPost.text AS original_post_text,
    OriginalPostUser.id AS original_poster_id, OriginalPostUser.name AS original_poster_name, OriginalPostUser.surname AS original_poster_surname, OriginalPostUser.username AS original_poster_username, OriginalPostUser.profile_pic_media_id AS original_poster_profile_pic_media_id
    FROM Posts CurrentPost 
    INNER JOIN Users CurrentPostUser ON CurrentPost.user_id = CurrentPostUser.id
    LEFT JOIN Posts OriginalPost1 ON CurrentPost.original_post_id = OriginalPost1.id
    LEFT JOIN Users OriginalPostUser ON OriginalPost1.user_id = OriginalPostUser.id
    LEFT JOIN Posts OriginalPost ON CurrentPost.original_post_id = OriginalPost.id AND (
    ((SELECT COUNT(*) FROM FollowRelations WHERE FollowRelations.user = ? AND FollowRelations.follows = OriginalPostUser.id AND FollowRelations.accepted = 1) = 1) OR 
    OriginalPostUser.profile_privacy_type = "public")
    INNER JOIN FollowRelations CurrentPostRelation ON CurrentPostRelation.user = ? AND CurrentPostRelation.follows = CurrentPostUser.id AND CurrentPostRelation.accepted = 1
    ORDER BY CurrentPost.time DESC
    LIMIT ? OFFSET ?`, [user_id, user_id, perPage, (page - 1) * perPage], async (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));

      return resolve(result);
    });

  });
};

module.exports = getFeed;