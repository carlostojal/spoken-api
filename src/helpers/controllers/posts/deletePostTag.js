
const deletePostTag = (post_id, tag_id, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);
      
      connection.query("DELETE FROM posttags WHERE post_id = ? AND tag_id = ?", [post_id, tag_id], (err, result) => {

        if(err)
          return reject(err);
        
        return resolve(null);
      });
    });
  });
};

module.exports = deletePostTag;