
const userReacted = (user, post) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT * FROM PostReactions WHERE user_id = ? AND post_id = ?`, [user.id, post.id], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userReacted;