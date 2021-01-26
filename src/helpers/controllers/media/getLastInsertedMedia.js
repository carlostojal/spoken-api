
const getLastInsertedMediaId = () => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
        mysqlClient = await require("../../../config/mysql");
    } catch(e) {
        return reject(e);
    }

    mysqlClient.query("SELECT id from Media WHERE id = (SELECT MAX(id) FROM Media)", (err, result) => {

      if(err) {
        return reject(err);
      }

      result = JSON.parse(JSON.stringify(result));
      result = result.length == 1 ? result[0].id : null;

      return resolve(result);
    });
  });
}

module.exports = getLastInsertedMediaId;