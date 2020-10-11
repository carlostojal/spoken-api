
const getUserByUsernameOrEmail = (username, mysqlClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`SELECT * FROM Users WHERE username LIKE ? OR email LIKE ?`, [username, username], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      const user = result.length == 1 ? result[0] : null;

      return resolve(user);
    });

  });
};

module.exports = getUserByUsernameOrEmail;