
const deleteSessionById = (session_id, user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("DELETE FROM Sessions WHERE id = ? AND user_id = ?", [session_id, user_id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
  
        return resolve(result);
      });
    });
  });
};

module.exports = deleteSessionById;
