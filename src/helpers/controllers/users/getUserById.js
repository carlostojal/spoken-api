
const getUserById = (id, mysqlClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`SELECT * FROM Users WHERE id LIKE '${id}'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(new Error("ERROR_GETTING_USER"));
      }

      result = JSON.parse(JSON.stringify(result));
      const user = result.length == 1 ? result[0] : null;

      return resolve(user);
    });

  });
};

module.exports = getUserById;