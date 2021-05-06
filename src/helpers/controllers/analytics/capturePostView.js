
const capturePostView = (user_id, post_id, user_lat, user_long, user_os, view_time, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("INSERT INTO PostViews (user_id, post_id, user_lat, user_long, user_os, view_time) VALUES" + 
        "(?, ?, ?, ?, ?, ?)", [user_id, post_id, user_lat, user_long, user_os, view_time], (err, result) => {

          if(err)
            return reject(err);

          return resolve(null);
        });
    });
  });
};

module.exports = capturePostView;