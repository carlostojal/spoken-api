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
      let p = null;
      try {
        p = Post.findById(post._id);
        p.is_toxic = true;
        p.toxic_cause = toxicity_result.cause;
        await p.save();
      } catch(e) {
        return reject(e);
      }
    }

    return resolve(null);
  });
};

module.exports = checkPostToxicity;
