
const acceptRelation = (user, follows, mysqlPool) => {
  return new Promise(async (resolve, reject) => {
    
    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`UPDATE FollowRelations SET accepted = ? WHERE user = ? AND follows = ?`, [1, user, follows], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });

    
  });
};

module.exports = acceptRelation;