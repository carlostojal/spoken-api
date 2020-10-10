
const formatComment = (comment) => {

  return {
    id: comment.id,
    user: {
      id: comment.user_id,
      name: comment.user_name,
      surname: comment.user_surname,
      username: comment.user_username,
      profile_pic_url: comment.profile_pic_media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.profile_pic_media_id}` : null
    },
    time: comment.time,
    text: comment.text,
    edited: comment.edited == 1
  }
};

module.exports = formatComment;