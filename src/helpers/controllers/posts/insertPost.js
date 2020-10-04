
const insertPost = (post, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`INSERT INTO Posts (id, user_id, time, text, media_id, original_post_id, edited) VALUES 
    (?, ?, ?, ?, ?, ?, ?)`, [post.id, post.user_id, post.time, post.text, post.media_id, post.original_post_id, 0], (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = insertPost;