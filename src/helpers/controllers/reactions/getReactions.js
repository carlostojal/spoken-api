
const getReactions = (post_id, page, perPage, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT User.id, User.name, User.surname, User.username
    FROM PostReactions 
    INNER JOIN Users User ON PostReactions.user_id = User.id
    WHERE PostReactions.post_id = ?
    ORDER BY PostReactions.time DESC
    LIMIT ? OFFSET ?`, [post_id, perPage, (page  -1) * perPage], (err, result) => {

      if(err) {
        return reject(err);
      }

      try {
        result = JSON.parse(JSON.stringify(result));
      } catch(e) {
        return reject(e);
      }

      return resolve(result);
    });
  });
};

module.exports = getReactions;