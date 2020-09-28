
const associateOriginalPost = (post_id, original_post_id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`UPDATE Posts SET original_post_id = '${original_post_id}' WHERE id = '${post_id}'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = associateOriginalPost;