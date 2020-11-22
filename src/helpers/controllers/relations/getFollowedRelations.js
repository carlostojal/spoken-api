
const getFollowedRelations = (user_id, accepted) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }
    
    mysqlClient.query(`SELECT User.id AS user_id, User.name AS user_name, User.surname AS user_surname, User.username AS user_username,
    Follows.id AS follows_id, Follows.name AS follows_name, Follows.surname AS follows_surname, Follows.username AS follows_username, 
    FollowRelations.accepted, FollowRelations.create_time
    FROM FollowRelations
    INNER JOIN Users User ON FollowRelations.user = User.id 
    INNER JOIN Users Follows ON FollowRelations.follows = Follows.id
    WHERE FollowRelations.follows = ? AND FollowRelations.accepted = ?`, [user_id, accepted ? 1 : 0], (err, result) => {

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

module.exports = getFollowedRelations;