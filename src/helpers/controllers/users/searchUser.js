const saveUserToCache = require("./saveUserToCache");

const searchUser = (query, mysqlClient, redisClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query("SELECT * FROM Users WHERE name LIKE ? OR surname LIKE ? OR username LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%'], (err, result) => {

      if(err)
        return reject(err);

      // save users in cache
      result.map((user) => {
        saveUserToCache(user, redisClient);
      });

      return resolve(result);
    });
  });
};

module.exports = searchUser;
