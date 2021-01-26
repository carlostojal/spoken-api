
const getSessions = (user_id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("SELECT * FROM Sessions WHERE user_id = ?", [user_id], (err, result) => {

      if(err) {
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));

      return resolve(result);
    })
  });
};

module.exports = getSessions;
