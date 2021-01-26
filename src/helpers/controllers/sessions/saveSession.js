
const saveSession = (session) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query("INSERT INTO Sessions (user_id, token, expires_at, user_platform) VALUES (?, ?, ?, ?)", 
    [session.user_id, session.token, session.expires_at, session.user_platform], (err, res) => {

      if(err) {
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = saveSession;