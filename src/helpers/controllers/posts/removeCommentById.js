
const removeCommentById = (id) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`DELETE FROM PostComments WHERE id = ?`, [id], (err, result) => {

      if(err) {
        
        return reject(err);
      }

      return resolve(null);
    })
  });
};

module.exports = removeCommentById;
