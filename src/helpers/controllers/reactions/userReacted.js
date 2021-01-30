
const userReacted = (user, post, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);
      
      connection.query(`SELECT * FROM PostReactions WHERE user_id = ? AND post_id = ?`, [user.id, post.id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(result && result.length == 1);
      });
    });
  });
};

module.exports = userReacted;