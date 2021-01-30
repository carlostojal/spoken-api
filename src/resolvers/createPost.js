const { AuthenticationError } = require("apollo-server");
const insertPost = require("../helpers/controllers/posts/insertPost");
const checkPostToxicity = require("../helpers/checkPostToxicity");

const createPost = (text, media_id, user, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // remove spaces from begginig and end
    text = text.trim();

    // replace consecutive multiple line breaks with double
    text = text.replace(/\n\s*\n/g, '\n\n');

    if(text.length == 0 || text.match(process.env.EMPTY_POST_REGEX))
      return reject(new Error("INVALID_TEXT"));

    const post = {
      user_id: user.id,
      text,
      media_id
    };

    // insert simple post
    try {
      await insertPost(post, mysqlPool);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // check if the post text is toxic (the user will not wait for this action)
    checkPostToxicity(post, mysqlPool);

    return resolve(post);
  });
}

module.exports = createPost;