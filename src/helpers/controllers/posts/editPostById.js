
const editPostById = (id, text) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`UPDATE Posts SET text = ?, edited = ? WHERE id = ?`, [text, 1, id], (err, result) => {

      if(err) {
        
        return reject(new Error("ERROR_UPDATING_POST"));
      }

      return resolve(null);
    });
  });
};

module.exports = editPostById;