const saveUserToCache = require("./saveUserToCache");

const searchUser = (query) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("SELECT * FROM Users WHERE name LIKE ? OR surname LIKE ? OR username LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%'], (err, result) => {

      if(err)
        return reject(err);

      // save users in cache
      result.map((user) => {
        saveUserToCache(user);
      });

      return resolve(result);
    });
  });
};

module.exports = searchUser;
