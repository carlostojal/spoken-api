
const removePostById = (id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`DELETE FROM Posts WHERE id = ?`, [id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });
  });
};

module.exports = removePostById;