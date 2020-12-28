
const acceptRelation = (user, follows) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`UPDATE FollowRelations SET accepted = ? WHERE user = ? AND follows = ?`, [1, user, follows], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = acceptRelation;