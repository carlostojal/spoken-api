
const getMediaById = (id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT Media.id, Media.time, Media.path, Users.id as uploader_id, Users.profile_privacy_type AS uploader_profile_type
     FROM Media INNER JOIN Users ON Media.user_id = Users.id WHERE Media.id LIKE ?`, [id], async (err, result) => {

      if(err) {
        
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      const media = result.length == 1 ? result[0] : null;

      return resolve(media);
    });

  });
};

module.exports = getMediaById;
