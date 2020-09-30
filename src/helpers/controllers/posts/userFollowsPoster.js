
const userFollowsPoster = (user, post, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT * FROM FollowRelations WHERE user = '${user.id}' AND follows = '${post.poster_id}' AND accepted = '1'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(err);
      }

      return resolve(result && result.length == 1);
    });
  });
};

module.exports = userFollowsPoster;