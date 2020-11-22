
const getUserByUsernameOrEmail = (username) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT * FROM Users WHERE username LIKE ? OR email LIKE ?`, [username, username], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      const user = result.length == 1 ? result[0] : null;

      mysqlClient.end();

      return resolve(user);
    });
  });
};

module.exports = getUserByUsernameOrEmail;