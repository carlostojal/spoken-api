const saveUserToCache = require("./saveUserToCache");

const getUserById = (id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT * FROM Users WHERE id LIKE ?`, [id], async (err, result) => {

      if(err)
        return reject(err);

      result = JSON.parse(JSON.stringify(result));
      const user = result.length == 1 ? result[0] : null;

      saveUserToCache(user);

      mysqlClient.end();

      return resolve(user);
    });
  });
};

module.exports = getUserById;