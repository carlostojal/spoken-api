const checkTextToxicity = require("./checkTextToxicity");
const Post = require("../db_models/Post");

const checkPostToxicity = (post) => {
  return new Promise(async (resolve, reject) => {

    let toxicity_result = null;
    try {
      toxicity_result = await checkTextToxicity(post.text);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    if(toxicity_result.is_toxic) {
      try {
        await Post.findByIdAndRemove(post.id);
      } catch(e) {
        return reject(new Error("ERROR_REMOVING_POST"));
      }
    }

    return resolve(null);
  });
};

module.exports = checkPostToxicity;
