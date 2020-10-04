require("@tensorflow/tfjs-node");
const toxicity = require("@tensorflow-models/toxicity");

const checkTextToxicity = (text, mysqlClient) => {
  return new Promise(async (resolve, reject) => {
    const threshold = 0.9;

    let model;
    try {
      model = await toxicity.load(threshold); 
    } catch(e) {
      return reject(new Error("ERROR_STARTING_TOXICITY_CHECKER"));
    }

    let predictions;
    try {
      predictions = await model.classify(text);
    } catch(e) {
      return reject(new Error("ERROR_CHECKING_TOXICITY"));
    }

    let result = {
      is_toxic: false,
      cause: null
    }

    predictions.map((prediction) => {
      if(prediction.results[0].match) {
        result.is_toxic = true;
        result.cause = prediction.label;
      }
    });

    return resolve(result);
  });
};

module.exports = checkTextToxicity;
