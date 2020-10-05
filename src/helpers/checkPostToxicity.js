const checkTextToxicity = require("./checkTextToxicity");
const removePostById = require("./controllers/posts/removePostById");

const checkPostToxicity = (post, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    let toxicity_result = null;
    try {
      toxicity_result = await checkTextToxicity(post.text);
    } catch(e) {
      
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    if(toxicity_result.is_toxic) {
      try {
        await removePostById(post.id, mysqlClient);
      } catch(e) {
        return reject(new Error("ERROR_REMOVING_POST"));
      }
    }

    return resolve(null);
  });
};

module.exports = checkPostToxicity;
