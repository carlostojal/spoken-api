
const formatPost = (post) => {

  return {
    id: post.id,
    poster: {
      id: post.poster_id,
      name: post.poster_name,
      surname: post.poster_surname,
      username: post.poster_username,
      profile_pic_url: post.profile_pic_media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.profile_pic_media_id}` : null
    },
    time: post.time,
    text: post.text,
    media_url: post.media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.media_id}` : null,
    edited: post.edited == 1
  }
};

module.exports = formatPost;