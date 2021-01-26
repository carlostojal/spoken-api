
const updateSessionToken = (old_token_value, new_token) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("UPDATE Sessions SET token = ?, created_at = ?, expires_at = ? WHERE token = ?", [new_token.value, new Date(), new Date(new_token.expires_at), old_token_value], (err, result) => {

      if(err) {
        return reject(err);
      }

      return resolve(null);
    });
  });   
}

module.exports = updateSessionToken;