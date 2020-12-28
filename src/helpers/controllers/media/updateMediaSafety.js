
const updateMediaSafety = (media_id, is_nsfw, nsfw_cause) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    mysqlClient.query(`UPDATE Media SET is_nsfw = ?, nsfw_cause = ?, review_status = ? WHERE id = ?`, 
    [is_nsfw, nsfw_cause, "done", media_id], (err, result) => {

      if(err) {
        return reject(err);  
      }

      return resolve(null);

    });

  });
};

module.exports = updateMediaSafety;