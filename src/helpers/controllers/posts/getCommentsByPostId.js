
const getCommentsByPostId = (post_id, page, perPage, mysqlClient) => {
  return new Promise((resolve, reject) => {
    mysqlClient.query(`SELECT PostComments.id, User.id as user_id, User.name as user_name, User.surname as user_surname, User.username as user_username, User.profile_pic_media_id, PostComments.time, PostComments.text,PostComments.edited FROM PostComments INNER JOIN Users ON PostComments.user_id = Users.id WHERE PostComments.post_id = ? ORDER BY PostComments.time DESC LIMIT ? OFFSET ?`, [post_id, perPage, (page - 1) * perPage], (err, result) => {

      if(err) {
        return reject(err);
      }

      return resolve(JSON.parse(JSON.stringify(result)));
    })
  });
}