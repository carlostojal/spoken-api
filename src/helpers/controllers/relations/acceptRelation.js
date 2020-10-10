
const acceptRelation = (user, follows, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`UPDATE FollowRelations SET accepted = ? WHERE user = ? AND follows = ?`, [1, user, follows], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = acceptRelation;