const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followRelationSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  follows: {type: Schema.Types.ObjectId, ref: "User"},
  create_time: {type: Schema.Types.Date, default: Date.now},
  accepted: Boolean,
  ignored: Boolean
});

module.exports = mongoose.model("FollowRelation", followRelationSchema);