
const getExpiredMedia = () => {
    return new Promise(async (resolve, reject) => {
        
        let mysqlClient;
        try {
            mysqlClient = await require("../../../config/mysql");
        } catch(e) {
            return reject(e);
        }

        let expiredTime = Date.now() - (process.env.MAX_UNUSED_MEDIA_AGE * 60 * 1000);

        mysqlClient.query("SELECT Media.* FROM Media LEFT JOIN Posts ON Posts.media_id = Media.id WHERE Posts.id IS NULL AND Media.time <= ?", [expiredTime], (err, result) => {

            if(err)
                return reject(err);

            result = JSON.parse(JSON.stringify(result));

            return resolve(result);
        });
    });
};

module.exports = getExpiredMedia;