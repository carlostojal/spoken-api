
const removeCommentById = (id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`DELETE FROM PostComments WHERE id = ?`, [id], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = removeCommentById;
