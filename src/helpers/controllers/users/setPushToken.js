
const setPushToken = (user_id, token, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`UPDATE Users SET push_token = ? WHERE id = ?`, [token, user_id], async (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });    
  });
};

module.exports = setPushToken;