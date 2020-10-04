
const removeReaction = (user, post, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`DELETE FROM PostReactions WHERE user_id = ? AND post_id = ?`, [user.id, post.id], (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = removeReaction;