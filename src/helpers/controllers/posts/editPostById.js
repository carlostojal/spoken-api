
const editPostById = (id, text, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`UPDATE Posts SET text = '${text}', edited = '1' WHERE id = '${id}'`, (err, result) => {

      if(err) {
        console.error(err);
        return reject(new Error("ERROR_UPDATING_POST"));
      }

      return resolve(null);
    });
  });
};

module.exports = editPostById;