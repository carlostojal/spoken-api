const checkTextToxicity = require("./checkTextToxicity");
const removeCommentById = require("./controllers/posts/removeCommentById");

const checkCommentToxicity = (comment, mysqlPool) => {
  return new Promise(async (resolve, reject) => {

    const toxicity_result = null;
    try {
      toxicity_result = await checkTextToxicity(post.text);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    if(toxicity_result.is_toxic) {
      try {
        await removeCommentById(comment.id, mysqlPool);
      } catch(e) {
        return reject(new Error("ERROR_REMOVING_COMMENT"));
      }
    }

    return resolve(null);
  });
};

module.exports = checkCommentToxicity;
