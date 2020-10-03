
const insertComment = (comment, mysqlClient) => {
  return new Promise((resolve, reject) => {
    
    mysqlClient.query(`INSERT INTO PostComments (id, user_id, post_id, time, text) VALUES ('${comment.id}', '${comment.user_id}', '${comment.post_id}', '${comment.time}', '${comment.text}')`, (err, result) => {
      
      if(err) {
        return reject(err);
      }

      return resolve(null);
    });
  });
};

module.exports = insertComment;
