
const updateSessionToken = (old_token_value, new_token, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("UPDATE Sessions SET token = ?, created_at = ?, expires_at = ? WHERE token = ?", [new_token.value, new Date(), new Date(new_token.expires_at), old_token_value], (err, result) => {

        connection.release();

        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });
  });   
}

module.exports = updateSessionToken;