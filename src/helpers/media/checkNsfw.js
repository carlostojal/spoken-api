const tf = require("@tensorflow/tfjs-node");
const nsfwjs = require("nsfwjs");
const fs = require("fs");
const updateMediaSafety = require("../controllers/media/updateMediaSafety");

const checkNsfw = (media, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    let model = null;
    try {
      model = await nsfwjs.load("file://src/models/nsfw/", { size: 299 });
    } catch(e) {
      return reject(new Error("ERROR_LOADING_MODEL"));
    }

    let image = null;
    try {
      image = fs.readFileSync(media.path);
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_READING_FILE"));
    }

    let predictions = null;
    try {
      predictions = await model.classify(tf.node.decodeImage(image));
    } catch(e) {
      return reject(new Error("ERROR_GETTING_PREDICTIONS"));
    }

    // classes not valid to NSFW classification
    const invalid_classes = ["Neutral", "Sexy"];

    let max = {
      class: null,
      prob: 0
    };
    
    predictions.map((prediction) => {
      if(!invalid_classes.includes(prediction.className)) {
        if(prediction.probability > max.prob) {
          max.class = prediction.className;
          max.prob = prediction.probability;
        }
      }
    });

    const is_nsfw = max.prob > parseFloat(process.env.MIN_NSFW_PROBABILITY);
    
    await updateMediaSafety(media.id, is_nsfw ? 1: 0, is_nsfw ? max.class : null, mysqlClient);

    // console.log(predictions);
    return resolve(null);
  });
};

module.exports = checkNsfw;