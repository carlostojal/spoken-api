
const associateMediaWithPost = (post_id, media_id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`UPDATE Posts SET media_id = '${media_id}' WHERE id = '${post_id}'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = associateMediaWithPost;