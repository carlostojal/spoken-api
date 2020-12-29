
const setPushToken = (user_id, token) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`UPDATE Users SET push_token = ? WHERE id = ?`, [token, user_id], async (err, result) => {

      if(err)
        return reject(err);

      return resolve(null);
    });
  });
};

module.exports = setPushToken;