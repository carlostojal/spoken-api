const { AuthenticationError } = require("apollo-server");
const checkPostToxicity = require("../helpers/checkPostToxicity");
const Post = require("../db_models/Post");
const Media = require("../db_models/Media");

const createPost = async (text, media_id, original_post_id, user) => {

  if(!user)
    throw new AuthenticationError("BAD_AUTHENTICATION");

  // remove spaces from begginig and end
  text = text.trim();

  // replace consecutive multiple line breaks with double
  text = text.replace(/\n\s*\n/g, '\n\n');

  if(text.length == 0 || text.match(process.env.EMPTY_POST_REGEX))
    throw new Error("INVALID_TEXT");

  const post = new Post({
    poster: user._id,
    text,
    media: media_id,
    original_post: original_post_id
  });

  if(media_id) {
    let user_is_media_owner = false;
    try {
      const media = Media.findOne({ _id: media_id, user_id: user.id});
      if(media)
        user_is_media_owner = true;
    } catch(e) {
      console.error(e);
      throw new Error("ERROR_CHECKING_MEDIA_OWNERSHIP");
    }

    // this media was uploaded by another user
    if(!user_is_media_owner)
      throw new Error("USER_IS_NOT_MEDIA_OWNER");
  }

  // insert simple post
  try {
    await post.save();
  } catch(e) {
    console.error(e);
    throw new Error("ERROR_REGISTERING_POST");
  }

  // check if the post text is toxic (the user will not wait for this action)
  checkPostToxicity(post);

  return post;
}

module.exports = createPost;