
const insertUser = (user) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`INSERT INTO Users (name, surname, birthdate, email, confirmation_code, username, password, profile_type, profile_privacy_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user.name, user.surname, user.birthdate, user.email, user.confirmation_code, user.username, user.password, user.profile_type, user.profile_privacy_type], (err, result) => {

      if(err) {
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = insertUser;