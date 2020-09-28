require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");
const removePostById = require("./controllers/posts/removePostById");

const checkPostToxicity = (post, mysqlClient) => {
  return new Promise(async (resolve, reject) => {
    const threshold = 0.9;

    let model;
    try {
      model = await toxicity.load(threshold); 
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_STARTING_TOXICITY_CHECKER"));
    }

    let predictions;
    try {
      predictions = await model.classify(post.text);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    await Promise.all(
      predictions.map((predictions) => {
        if(predictions.results[0].match) {
          console.log(`Post will be removed for ${predictions.label}.`);
          removePostById(post.id, mysqlClient).catch((e) => {
            console.error(e);
            return reject(new Error("ERROR_REMOVING_POST"));
          });
        }
      })
    );

    console.log("Toxicity checks done.");

    return resolve(null);
  });
};

module.exports = checkPostToxicity;