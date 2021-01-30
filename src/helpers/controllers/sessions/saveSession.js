
const saveSession = (session, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);
      
      connection.query("INSERT INTO Sessions (user_id, token, expires_at, user_platform) VALUES (?, ?, ?, ?)", 
      [session.user_id, session.token, session.expires_at, session.user_platform], (err, res) => {

        connection.release();
  
        if(err)
          return reject(err);
  
        return resolve(null);
      });
    });

    
  });
};

module.exports = saveSession;