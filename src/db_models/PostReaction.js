const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationPointSchema = require("./LocationPointSchema");

// the user IDs are also stored in the Post documents
// the reactions here are used for easier analytics extraction
const postReactionSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  post: {type: Schema.Types.ObjectId, ref: "Post"},
  user_location: {
    type: LocationPointSchema,
    index: "2dsphere"
  },
  user_platform: String,
  user_os: String,
  time: {type: Schema.Types.Date, default: Date.now}
});

module.exports = mongoose.model("PostReaction", postReactionSchema);