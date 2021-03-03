
const userIsMediaOwner = (media_id, user, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT * FROM Media WHERE id = ? AND user_id = ?`, [media_id, user.id], (err, result) => {

        connection.release();
  
        if(err)
          return reject(err);
  
        return resolve(result && result.length > 0);
      });
    });
  });
};

module.exports = userIsMediaOwner;