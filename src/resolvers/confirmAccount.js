const getUserById = require("../helpers/mysql/users/getUserById");

const confirmAccount = (user_id, code, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    const update = (user) => {
      return new Promise((resolve, reject) => {
        mysqlClient.query(`UPDATE Users SET email_confirmed = 1 WHERE id = '${user.id}'`, (err, result) => {

          if(err) {
            console.error(err);
            return reject(new Error("ERROR_UPDATING_USER"));
          }

          return resolve(user)
        });
      });
    }

    let user = null;
    try {
      user = await getUserById(user_id, mysqlClient);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user) return reject(new Error("USER_NOT_FOUND"));

    if(!user.email_confirmed) {
      if(user.confirmation_code == code) {
        try {
          await update(user);
        } catch(e) {
          console.error(e);
          return reject(new Error("ERROR_UPDATING_USER"));
        }
      } else {
        return reject(new Error("WRONG_CONFIRMATION_CODE"));
      }
    }
    
    return resolve(user);
  });
};

module.exports = confirmAccount;