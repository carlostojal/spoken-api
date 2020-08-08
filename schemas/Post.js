const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

module.exports = new Schema({
  poster: Schema.ObjectId,
  time: Number,
  text: String
});

