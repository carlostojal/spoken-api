
const userFollowsUser = (user_id, user1_id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT * FROM FollowRelations WHERE user = ? AND follows = ? AND accepted = ?`, [user_id, user1_id, 1], (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userFollowsUser;