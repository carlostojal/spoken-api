const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// the user IDs are also stored in the Post documents
// the reactions here are used for easier analytics extraction
const postReactionSchema = new Schema({
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

module.exports = mongoose.model("PostReaction", postReactionSchema);