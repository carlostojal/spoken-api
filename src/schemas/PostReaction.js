const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postReaction = new Schema({
  time: String,
  post: { type: Schema.ObjectId, ref: 'Post' },
  user: { type: Schema.ObjectId, ref: 'User' }
});

postReaction.index({ post: 1, user: 1 }, { unique: true });

module.exports = postReaction;