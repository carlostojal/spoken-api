const saveUserToCache = require("./saveUserToCache");

const getUserById = (id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err) 
        return reject(err);

      connection.query(`SELECT * FROM Users WHERE id LIKE ?`, [id], async (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        result = JSON.parse(JSON.stringify(result));
        const user = result.length == 1 ? result[0] : null;
  
        // saveUserToCache(user);
  
        return resolve(user);
      });
    });
  });
};

module.exports = getUserById;