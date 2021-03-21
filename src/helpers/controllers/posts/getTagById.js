
const getTagById = (tag_id, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {
      
      if(err)
        return reject(err);

      connection.query("SELECT * FROM tags WHERE id = ?", [tag_id], (err, result) => {

        if(err)
          return reject(err);

        result = JSON.parse(JSON.stringify(result));

        return resolve(result);
      });
    })
  });
};

module.exports = getTagById;