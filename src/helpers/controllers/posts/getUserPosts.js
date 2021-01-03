
const getUserPosts = (page, per_page, user_id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`SELECT Posts.id, Posts.time, Posts.text, Users.id AS poster_id, Users.name AS poster_name, 
      Users.surname AS poster_surname, Users.username AS poster_username FROM Posts INNER JOIN Users ON
      Posts.user_id = Users.ID WHERE Users.id = ? ORDER BY Posts.time DESC 
      LIMIT ? OFFSET ?`, [user_id, per_page, (page - 1) * per_page], async (err, result) => {

        if(err)
          return reject(err);
        
        result = JSON.parse(JSON.stringify(result));

        return resolve(result);
      });

  });
};

module.exports = getUserPosts;