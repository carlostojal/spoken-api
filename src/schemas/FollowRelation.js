const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followRelation = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  follows: { type: Schema.ObjectId, ref: 'User' },
  accepted: Boolean
});

followRelation.index({ user: 1, follows: 1 }, { unique: true });

module.exports = followRelation;