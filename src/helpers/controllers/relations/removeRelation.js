
const removeRelation = (user, follows) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`DELETE FROM FollowRelations WHERE user = ? AND follows = ?`, [user, follows], (err, result) => {
      
      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = removeRelation;