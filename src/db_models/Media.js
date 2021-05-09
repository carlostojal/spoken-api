const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  url: String,
  time: {type: Schema.Types.Date, default: Date.now},
  keywords: String,
  is_nsfw: Boolean,
  nsfw_cause: String,
  review_status: String,
  type: String
});

module.exports = mongoose.model("Media", mediaSchema);