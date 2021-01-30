
const insertReaction = (user_id, post_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`INSERT INTO PostReactions (user_id, post_id) VALUES (?, ?, ?, ?)`, [user_id, post_id], (err, result) => {

        connection.release();
    
        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });
  });
};

module.exports = insertReaction;