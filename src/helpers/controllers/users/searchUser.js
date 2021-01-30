const saveUserToCache = require("./saveUserToCache");

const searchUser = (query, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("SELECT * FROM Users WHERE name LIKE ? OR surname LIKE ? OR username LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%'], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        // save users in cache
        result.map((user) => {
          saveUserToCache(user);
        });
  
        return resolve(result);
      });
    });
  });
};

module.exports = searchUser;
