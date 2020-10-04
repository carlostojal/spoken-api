
const userReacted = (user, post, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT * FROM PostReactions WHERE user_id = ? AND post_id = ?`, [user.id, post.id], (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userReacted;