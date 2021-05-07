const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postViewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  post: {type: Schema.Types.ObjectId, ref: "Post"},
  user_location: {
    latitude: Number,
    longitude: Number
  },
  user_platform: String,
  user_os: String,
  time: {type: Schema.Types.Date, default: Date.now}
});

module.exports = mongoose.model("PostView", postViewSchema);