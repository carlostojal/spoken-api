const tf = require("@tensorflow/tfjs-node");
const nsfwjs = require("nsfwjs");
const getImageData = require("get-image-data/native");
const fs = require("fs");

const checkNsfw = (path, mysqlClient) => {
  return new Promise(async (resolve, reject) => {

    let model = null;
    try {
      model = await nsfwjs.load("file://src/models/nsfw/", { size: 299 });
    } catch(e) {
      return reject(new Error("ERROR_LOADING_MODEL"));
    }

    let image = null;
    try {
      image = fs.readFileSync(path);
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

    console.log(predictions);
    return resolve(predictions);
  });
};

module.exports = checkNsfw;