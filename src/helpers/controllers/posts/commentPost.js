
const commentPost = (post, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`INSERT INTO Posts (id, user_id, time, text, edited) VALUES ('${post.id}', '${post.user_id}', '${post.time}', '${post.text}', '0')`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = commentPost;