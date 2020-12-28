
const insertPost = (post) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`INSERT INTO Posts (id, user_id, time, text, media_id, original_post_id, edited) VALUES 
    (?, ?, ?, ?, ?, ?, ?)`, [post.id, post.user_id, post.time, post.text, post.media_id, post.original_post_id, 0], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = insertPost;