
const getSessionByToken = (token) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("SELECT * FROM Sessions WHERE token = ?", [token], (err, result) => {

      if(err) {
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      result = result.length == 1 ? result[0] : null

      return resolve(result);
    });

  })
};

module.exports = getSessionByToken;