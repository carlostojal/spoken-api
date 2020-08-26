const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  time: String,
  post: { type: Schema.ObjectId, ref: 'Post' },
  user: { type: Schema.ObjectId, ref: 'User' },
  text: String
});