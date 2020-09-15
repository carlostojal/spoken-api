const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  poster: { type: Schema.ObjectId, ref: 'User' },
  time: String,
  text: String,
  media: { type: Schema.ObjectId, ref: 'Media'},
  original_post: { type: Schema.ObjectId, ref: 'Post' }, // used in post shares
  edited: Boolean
});