const tf = require("@tensorflow/tfjs-node");
const nsfwjs = require("nsfwjs");
const fs = require("fs");
const updateMediaSafety = require("../controllers/media/updateMediaSafety");

const checkNsfw = (media) => {
  return new Promise(async (resolve, reject) => {

    let mysqlClient;
    try {
      mysqlClient = await require("../../config/mysql");
    } catch(e) {
      return reject(e);
    }

    let model = null;
    try {
      model = await nsfwjs.load(`${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/nsfw_model/`, {size: 299});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_LOADING_MODEL"));
    }

    let image = null;
    try {
      image = fs.readFileSync(media.path);
    } catch(e) {
      return reject(new Error("ERROR_READING_FILE"));
    }

    let predictions = null;
    try {
      predictions = await model.classify(tf.node.decodeImage(image));
    } catch(e) {
      return reject(new Error("ERROR_GETTING_PREDICTIONS"));
    }

    // classes not considered NSFW for this case
    const invalid_classes = ["Neutral", "Sexy", "Drawing"];

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
    
    await updateMediaSafety(media.id, is_nsfw ? 1: 0, is_nsfw ? max.class : null);

    // console.log(predictions);
    return resolve(null);
  });
};

module.exports = checkNsfw;