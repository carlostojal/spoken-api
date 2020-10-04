
const insertReaction = (reaction, mysqlClient) => {
  return new Promise((resolve, reject) => {

    mysqlClient.query(`INSERT INTO PostReactions (id, user_id, post_id, time, text) VALUES (?, ?, ?, ?, ?)`, [reaction.id, reaction.user_id, reaction.post_id, reaction.time, reaction.text], (err, result) => {
      
      if(err) {
        console.error(err);
        return reject(new Error("ERROR_INSERTING_REACTION"));
      }

      return resolve(null);
    });
  });
};

module.exports = insertReaction;