const saveUserToCache = require("./saveUserToCache");

const getUserById = (id, mysqlClient, redisClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`SELECT * FROM Users WHERE id LIKE ?`, [id], (err, result) => {

      if(err)
        return reject(err);

      result = JSON.parse(JSON.stringify(result));
      const user = result.length == 1 ? result[0] : null;

      saveUserToCache(user, redisClient);

      return resolve(user);
    });

  });
};

module.exports = getUserById;