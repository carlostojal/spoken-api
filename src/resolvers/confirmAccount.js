const getUserByUsernameOrEmail = require("../helpers/controllers/users/getUserByUsernameOrEmail");

const confirmAccount = (username, code, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection(async (err, connection) => {

      if(err)
        return reject(err);

      const update = (user) => {
        return new Promise((resolve, reject) => {
          connection.query(`UPDATE Users SET email_confirmed = 1 WHERE id = '${user.id}'`, (err, result) => {

            connection.release();
  
            if(err)
              return reject(new Error("ERROR_UPDATING_USER"));
  
            return resolve(user)
          });
        });
      }
  
      let user = null;
      try {
        user = await getUserByUsernameOrEmail(username, mysqlPool);
      } catch(e) {
        return reject(new Error("ERROR_GETTING_USER"));
      }
  
      if(!user) return reject(new Error("USER_NOT_FOUND"));
  
      if(!user.email_confirmed) {
        if(user.confirmation_code == code) {
          try {
            await update(user);
          } catch(e) {
            return reject(new Error("ERROR_UPDATING_USER"));
          }
        } else {
          return reject(new Error("WRONG_CONFIRMATION_CODE"));
        }
      }
      
      return resolve(user);

    });
  });
};

module.exports = confirmAccount;