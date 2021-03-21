
const addPostTag = (post_id, tag_id, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("INSERT INTO posttags (post_id, tag_id) VALUES (?, ?)", [post_id, tag_id], (err, result) => {

        if(err)
          return reject(err);
        
        return resolve(null);
      });
    });
  });
};

module.exports = addPostTag;