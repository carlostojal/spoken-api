const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  poster: { type: Schema.ObjectId, ref: 'User' },
  time: String,
  text: String,
  media: { type: Schema.ObjectId, ref: 'Media'},
  edited: Boolean,
  reactions: [{ type: Schema.ObjectId, ref: 'PostReaction' }],
  comments: [{ type: Schema.ObjectId, ref: 'PostComment' }]
});