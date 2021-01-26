
const insertMedia = (media) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("INSERT INTO Media (user_id, path) VALUES (?, ?)", [media.user_id, media.path, media.time, media.keywords, media.is_nsfw, media.nsfw_cause, media.review_status], (err, result) => {

        if(err) {
          return reject(err);
        }

        return resolve(null);
    });
  });
};

module.exports = insertMedia;