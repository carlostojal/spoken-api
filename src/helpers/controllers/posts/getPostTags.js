
const getPostTags = (post_id, mysqlPool) => {
  return new Promise((resolve, reject) => {

    mysqlPool.getConnection((err, connection) => {

      if(err)
        return reject(err);

      connection.query("SELECT tags.* FROM tags INNER JOIN posttags ON tags.id = posttags.tag_id AND posttags.post_id = ?", [post_id], async (err, result) => {

        if(err)
          return reject(err);

        result = JSON.parse(JSON.stringify(result));

        return resolve(result);
      });
    });
  });
};

module.exports = getPostTags;