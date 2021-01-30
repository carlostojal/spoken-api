
const insertPost = (post, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`INSERT INTO Posts (user_id, text, media_id, original_post_id) VALUES 
      (?, ?, ?, ?)`, [post.user_id, post.text, post.media_id, post.original_post_id], (err, result) => {

        connection.release();
  
        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });
  });
};

module.exports = insertPost;