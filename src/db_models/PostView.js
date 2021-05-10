const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationPointSchema = require("./LocationPointSchema");

const postViewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  post: {type: Schema.Types.ObjectId, ref: "Post"},
  user_location: {
    type: LocationPointSchema,
    index: "2dsphere"
  },
  user_platform: String,
  user_os: String,
  time: {type: Schema.Types.Date, default: Date.now},
  view_time: Number
});

module.exports = mongoose.model("PostView", postViewSchema);