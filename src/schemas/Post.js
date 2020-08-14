const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

module.exports = new Schema({
  poster: { type: Schema.ObjectId, ref: 'User' },
  time: String,
  text: String,
  edited: Boolean
});

