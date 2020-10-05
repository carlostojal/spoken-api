
const formatPost = (post) => {

  return {
    id: post.id,
    original_post: {
      id: post.original_post_id,
      poster: {
        id: post.original_poster_id,
        name: post.original_poster_name,
        surname: post.original_poster_surname,
        username: post.original_poster_username,
        profile_pic_url: post.original_poster_profile_pic_media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.original_poster_profile_pic_media_id}` : null
      },
      time: post.original_post_time,
      text: post.original_post_text
    },
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
