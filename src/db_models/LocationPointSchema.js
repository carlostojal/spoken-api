const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationPointSchema = new Schema({
  type: {type: String, default: "Point"},
  coordinates: [Number]
});

module.exports = locationPointSchema;