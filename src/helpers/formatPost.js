
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
        profile_pic: {
          id: post.poster_profile_pic_media_id,
          url: post.poster_profile_pic_media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.original_poster_profile_pic_media_id}` : null,
          is_nsfw: post.poster_is_nsfw,
          nsfw_cause: post.poster_nsfw_cause
        }
      },
      time: post.original_post_time,
      text: post.original_post_text
    },
    poster: {
      id: post.poster_id,
      name: post.poster_name,
      surname: post.poster_surname,
      username: post.poster_username,
      profile_pic: {
        id: post.original_poster_profile_pic_media_id,
        url: post.original_poster_profile_pic_media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.original_poster_profile_pic_media_id}` : null,
        is_nsfw: post.original_poster_is_nsfw,
        nsfw_cause: post.original_poster_nsfw_cause
      }
    },
    time: new Date(post.time).getTime(),
    text: post.text,
    media: {
      id: post.media_id,
      url: post.media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.media_id}` : null,
      is_nsfw: post.media_is_nsfw,
      nsfw_cause: post.media_nsfw_cause
    },
    media_url: post.media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.media_id}` : null,
    user_reacted: post.user_reacted,
    edited: post.edited == 1
  }
};

module.exports = formatPost;
