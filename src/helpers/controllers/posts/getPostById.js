const savePostToCache = require("./savePostToCache");

const getPostById = (id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT Posts.id, Posts.time, Posts.text, Posts.edited,
      Users.id poster_id, Users.name AS poster_name, Users.surname AS poster_surname, Users.username AS poster_username,
      Media.id AS media_id, Media.is_nsfw AS media_is_nsfw, Media.nsfw_cause AS media_nsfw_cause
      FROM Posts 
      INNER JOIN Users ON Posts.user_id = Users.id
      LEFT JOIN Media ON Posts.media_id = Media.id
      WHERE Posts.id = ?`, [id], async (err, result) => {

        connection.release();
  
        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
        const post = result.length == 1 ? result[0] : null;
  
        savePostToCache(post);
  
        return resolve(post);
      });
    });
  });
};

module.exports = getPostById;
