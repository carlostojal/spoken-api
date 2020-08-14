const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  uploader: { type: Schema.ObjectId, ref: 'User' },
  path: String
});

