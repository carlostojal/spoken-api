
const removeReaction = (user_id, post_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {
    
    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`DELETE FROM PostReactions WHERE user_id = ? AND post_id = ?`, [user_id, post_id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });

    
  });
};

module.exports = removeReaction;