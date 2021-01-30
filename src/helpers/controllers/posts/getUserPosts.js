
const getUserPosts = (page, per_page, user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT Posts.id, Posts.time, Posts.text, Posts.edited, (SELECT COUNT(*) FROM PostReactions WHERE post_id = Posts.id AND user_id = ?) AS user_reacted,
      Users.id poster_id, Users.name AS poster_name, Users.surname AS poster_surname, Users.username AS poster_username,
      Media.id AS media_id, Media.is_nsfw AS media_is_nsfw, Media.nsfw_cause AS media_nsfw_cause
      FROM Posts 
      INNER JOIN Users ON Posts.user_id = Users.id
      LEFT JOIN Media ON Posts.media_id = Media.id
      WHERE Posts.user_id = ?
      ORDER BY Posts.time DESC
      LIMIT ? OFFSET ?`, [user_id, user_id, per_page, (page - 1) * per_page], async (err, result) => {

        connection.release();

        if(err)
          return reject(err);
        
        result = JSON.parse(JSON.stringify(result));

        return resolve(result);
      });
    });
  });
};

module.exports = getUserPosts;