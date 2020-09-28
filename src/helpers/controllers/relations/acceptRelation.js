
const acceptRelation = (user, follows, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`UPDATE FollowRelations SET accepted = '1' WHERE user = '${user}' AND follows = '${follows}'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = acceptRelation;