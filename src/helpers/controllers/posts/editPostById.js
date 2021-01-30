
const editPostById = (id, text, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`UPDATE Posts SET text = ?, edited = ? WHERE id = ?`, [text, 1, id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });

    
  });
};

module.exports = editPostById;