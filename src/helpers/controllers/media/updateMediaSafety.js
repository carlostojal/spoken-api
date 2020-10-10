
const updateMediaSafety = (media_id, is_nsfw, nsfw_cause, mysqlClient) => {
  return new Promise((resolve, reject) => {

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