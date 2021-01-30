
const userFollowsUser = (user_id, user1_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT * FROM FollowRelations WHERE user = ? AND follows = ? AND accepted = ?`, [user_id, user1_id, 1], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(result && result.length == 1);
      });
    });
  });
};

module.exports = userFollowsUser;