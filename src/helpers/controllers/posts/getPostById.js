const cache = require("../../cache/cache");

const getPostById = (id, redisClient, mysqlClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`SELECT Posts.id, Posts.time, Posts.text, Posts.media_id, Posts.edited, Users.id AS poster_id, Users.name AS poster_name, Users.surname AS poster_surname, Users.username AS poster_username, Users.profile_pic_media_id FROM Posts INNER JOIN Users ON Posts.user_id = Users.id WHERE Posts.id LIKE '${id}'`, async (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      const post = result.length == 1 ? result[0] : null;

      try {
        cache(`post-${post.id}`, null, JSON.stringify(result), process.env.POST_CACHE_DURATION, true, true, redisClient);
      } catch(e) {
        console.error(e);
      }

      return resolve(post);
    });

  });
};

module.exports = getPostById;