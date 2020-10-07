
const getCommentsByPostId = (post_id, page, perPage, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT CurrentPost.id, CurrentPost.time, CurrentPost.text, CurrentPost.media_id, CurrentPost.edited, 
      OriginalPost.id AS original_post_id, OriginalPost.time AS original_post_time, OriginalPost.text AS original_post_text, OriginalPost.edited AS original_post_edited,
      OriginalPostUser.id AS original_poster_id, OriginalPostUser.name AS original_poster_name, OriginalPostUser.surname AS original_poster_surname, OriginalPostUser.username AS original_poster_username, OriginalPostUser.profile_pic_media_id AS original_poster_profile_pic_media_id,
      Users.id AS poster_id, Users.name AS poster_name, Users.surname AS poster_surname, Users.username AS poster_username, Users.profile_pic_media_id FROM 
      Posts CurrentPost INNER JOIN Users ON CurrentPost.user_id = Users.id 
      LEFT JOIN Posts OriginalPost ON CurrentPost.original_post_id = OriginalPost.id 
      LEFT JOIN Users OriginalPostUser ON OriginalPost.user_id = OriginalPostUser.id 
      WHERE original_post_id = ? LIMIT ? OFFSET ? ORDER BY CurrentPost.time DESC`, [post_id, perPage, (page - 1) * perPage], async (err, result) => {

      if(err) {
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));

      return resolve(result);
    });
  });
}