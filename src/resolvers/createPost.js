const { AuthenticationError } = require("apollo-server");
const generateId = require("../helpers/generateId");
const insertPost = require("../helpers/controllers/posts/insertPost");
const getPostById = require("../helpers/controllers/posts/getPostById");
const formatPost = require("../helpers/formatPost");
const checkPostToxicity = require("../helpers/checkPostToxicity");

const createPost = (text, media_id, user) => {
  return new Promise(async (resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    // remove spaces from begginig and end
    text = text.trim();

    // replace consecutive multiple line breaks with single
    text = text.replace(/\n\s*\n/g, '\n');

    if(text.length == 0 || text.match(process.env.EMPTY_POST_REGEX))
      return reject(new Error("INVALID_TEXT"));

    const post = {
      id: generateId(),
      user_id: user.id,
      time: Date.now(),
      text,
      media_id
    };

    // insert simple post
    try {
      await insertPost(post);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_REGISTERING_POST"));
    }

    // get the post from the database
    let post1 = null;
    try {
      post1 = await getPostById(post.id);
    } catch(e) {
      return reject(new Error("ERROR_GETTING_POST"));
    }

    // format post to be like in the expected form from GraphQL typedefs
    try {
      post1 = formatPost(post1);
    } catch(e) {
      return reject(new Error("ERROR_FORMATING_POST"));
    }

    // check if the post text is toxic (the user will not wait for this action)
    checkPostToxicity(post);

    return resolve(post1);
  });
}

module.exports = createPost;