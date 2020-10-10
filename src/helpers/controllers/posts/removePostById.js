
const removePostById = (id, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`DELETE FROM Posts WHERE id = ?`, [id], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = removePostById;