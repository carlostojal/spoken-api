const checkTextToxicity = require("./checkTextToxicity");
const removeCommentById = require("./controllers/posts/removeCommentById");

const checkCommentToxicity = (comment, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    const toxicity_result = null;
    try {
      toxicity_result = await checkTextToxicity(post.text);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    if(toxicity_result.is_toxic) {
      console.log(`Comment will be removed for ${toxicity_result.cause}.`);
      try {
        await removeCommentById(comment.id, mysqlClient);
      } catch(e) {
        return reject(new Error("ERROR_REMOVING_COMMENT"));
      }
    } else {
      console.log("Toxicity checks passed.");
    }

    return resolve(null);
  });
};

module.exports = checkCommentToxicity;
