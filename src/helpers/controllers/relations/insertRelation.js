
const insertRelation = (relation) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`INSERT INTO FollowRelations (user, follows, accepted) VALUES (?, ?, ?)`, [relation.user, relation.follows, relation.accepted ? 1 : 0], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = insertRelation;