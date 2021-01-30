
const getSessionByToken = (token, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("SELECT * FROM Sessions WHERE token = ?", [token], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
        result = result.length == 1 ? result[0] : null
  
        return resolve(result);
      });      
    });
  })
};

module.exports = getSessionByToken;