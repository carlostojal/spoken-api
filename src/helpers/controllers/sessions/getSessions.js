
const getSessions = (user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("SELECT * FROM Sessions WHERE user_id = ?", [user_id], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
  
        return resolve(result);
      });
    });
  });
};

module.exports = getSessions;
