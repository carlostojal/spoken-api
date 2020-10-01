
const userFollowsUser = (user_id, user1_id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT * FROM FollowRelations WHERE user = '${user_id}' AND follows = '${user1_id}' AND accepted = '1'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userFollowsUser;