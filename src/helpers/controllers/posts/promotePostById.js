
const promotePostById = (id, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`UPDATE Posts SET promoted = ? WHERE id = ?`, [1, id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });
  });
};

module.exports = promotePostById;