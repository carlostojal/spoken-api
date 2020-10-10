
const insertMedia = (media, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query("INSERT INTO Media (id, user_id, path, time, keywords, is_nsfw, nsfw_cause, review_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [media.id, media.user_id, media.path, media.time, media.keywords, media.is_nsfw, media.nsfw_cause, media.review_status], (err, result) => {

        if(err) {
          return reject(err);
        }

        return resolve(null);
    });
  });
};

module.exports = insertMedia;