const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  poster: {type: Schema.Types.ObjectId, ref: "User"},
  time: {type: Schema.Types.Date, default: Date.now},
  text: String,
  media: {type: Schema.Types.ObjectId, ref: "Media"},
  tags: [{type: Schema.Types.ObjectId, ref: "Tag"}],
  original_post: {type: Schema.Types.ObjectId, ref: "Post"},
  edited: Boolean,
  promoted: Boolean,
  is_toxic: Boolean,
  toxic_cause: String,
  review_status: String
});

module.exports = mongoose.model("Post", postSchema);