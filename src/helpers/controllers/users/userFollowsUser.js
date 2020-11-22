
const userFollowsUser = (user_id, user1_id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT * FROM FollowRelations WHERE user = ? AND follows = ? AND accepted = ?`, [user_id, user1_id, 1], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userFollowsUser;