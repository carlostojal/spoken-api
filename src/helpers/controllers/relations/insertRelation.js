
const insertRelation = (relation, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`INSERT INTO FollowRelations (user, follows, create_time, accepted) VALUES ('${relation.user}', '${relation.follows}', '${relation.create_time}', '${relation.accepted ? 1 : 0}')`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = insertRelation;