
const removeRelation = (user, follows, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`DELETE FROM FollowRelations WHERE user = '${user}' AND follows = '${follows}'`, (err, result) => {
      
      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = removeRelation;