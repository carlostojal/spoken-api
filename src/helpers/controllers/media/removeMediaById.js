
const removeMediaById = (id) => {
    return new Promise(async (resolve, reject) => {

        let mysqlClient;
        try {
            mysqlClient = await require("../../../config/mysql");
        } catch(e) {
            return reject(e);
        }

        mysqlClient.query("DELETE FROM Media WHERE id = ?", [id], (err, result) => {

            if(err)
                return reject(e);

            return resolve(null);
        });
    });
};

module.exports = removeMediaById;