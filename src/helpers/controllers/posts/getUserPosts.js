
const getUserPosts = (page, per_page, user_id, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query(`SELECT Posts.id, Posts.time, Posts.text, Users.id AS poster_id, Users.name AS poster_name, 
      Users.surname AS poster_surname, Users.username AS poster_username FROM Posts INNER JOIN Users ON
      Posts.user_id = Users.ID WHERE Users.id = ? ORDER BY Posts.time DESC 
      LIMIT ? OFFSET ?`, [user_id, per_page, (page - 1) * per_page], async (err, result) => {

        connection.release();

        if(err)
          return reject(err);
        
        result = JSON.parse(JSON.stringify(result));

        return resolve(result);
      });
    });
  });
};

module.exports = getUserPosts;