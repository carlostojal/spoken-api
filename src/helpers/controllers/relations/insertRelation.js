
const insertRelation = (relation, mysqlPool) => {
  return new Promise(async (resolve, reject) => {
    
    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`INSERT INTO FollowRelations (user, follows, accepted) VALUES (?, ?, ?)`, [relation.user, relation.follows, relation.accepted ? 1 : 0], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    })

    
  });
};

module.exports = insertRelation;