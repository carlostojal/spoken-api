
const formatPost = (post) => {

  return {
    id: post.id,
    poster: {
      id: post.poster_id,
      name: post.poster_name,
      surname: post.poster_surname,
      username: post.poster_username
    },
    time: new Date(post.time),
    text: post.text,
    media: {
      id: post.media_id,
      url: post.media_id ? `${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/media/${post.media_id}` : null,
      is_nsfw: post.media_is_nsfw,
      nsfw_cause: post.media_nsfw_cause
    },
    user_reacted: post.user_reacted,
    edited: post.edited == 1
  }
};

module.exports = formatPost;
