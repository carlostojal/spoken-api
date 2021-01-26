
const insertPost = (post) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`INSERT INTO Posts (user_id, text, media_id, original_post_id) VALUES 
    (?, ?, ?, ?)`, [post.user_id, post.text, post.media_id, post.original_post_id], (err, result) => {

      if(err) {
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = insertPost;