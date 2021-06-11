const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  poster: {type: Schema.Types.ObjectId, ref: "User"},
  time: {type: Schema.Types.Date, default: Date.now},
  text: String,
  media: {type: Schema.Types.ObjectId, ref: "Media"},
  tags: [{type: Schema.Types.ObjectId, ref: "Tag"}],
  // in this array are stored the IDs of the users which have reacted
  // the detailed data is stored in the PostReactions documents
  // the reactions here are passed to the frontend
  reactions: [{type: Schema.Types.ObjectId, ref: "User"}],
  comments: [{type: Schema.Types.ObjectId, ref: "Post"}],
  viewers: [{type: Schema.Types.ObjectId, ref: "User"}],
  original_post: {type: Schema.Types.ObjectId, ref: "Post"},
  edited: {type: Schema.Types.Boolean, default: false},
  promoted: {type: Schema.Types.Boolean, default: false},
  is_toxic: {type: Schema.Types.Boolean, default: false},
  toxic_cause: String,
  review_status: String
});

postSchema.index({
  "text": "text",
  "tags": "text",
});

module.exports = mongoose.model("Post", postSchema);