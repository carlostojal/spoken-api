
const getUserByUsernameOrEmail = (username, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT * FROM Users WHERE username LIKE ? OR email LIKE ?`, [username, username], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
        const user = result.length == 1 ? result[0] : null;
  
        return resolve(user);
      });
    });

    
  });
};

module.exports = getUserByUsernameOrEmail;