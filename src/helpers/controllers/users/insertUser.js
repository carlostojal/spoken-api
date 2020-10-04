
const insertUser = (user, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`INSERT INTO Users (id, name, surname, birthdate, email, confirmation_code, username, password, profile_type, profile_privacy_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user.id, user.name, user.surname, user.birthdate, user.email, user.confirmation_code, user.username, user.password, user.profile_type, user.profile_privacy_type], (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = insertUser;