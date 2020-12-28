const checkTextToxicity = require("./checkTextToxicity");
const removeCommentById = require("./controllers/posts/removeCommentById");

const checkCommentToxicity = (comment) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    const toxicity_result = null;
    try {
      toxicity_result = await checkTextToxicity(post.text);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    if(toxicity_result.is_toxic) {
      try {
        await removeCommentById(comment.id);
      } catch(e) {
        return reject(new Error("ERROR_REMOVING_COMMENT"));
      }
    }

    return resolve(null);
  });
};

module.exports = checkCommentToxicity;
