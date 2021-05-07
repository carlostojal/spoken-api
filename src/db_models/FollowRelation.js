const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followRelationSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  follows: {type: Schema.Types.ObjectId, ref: "User"},
  create_time: {type: Schema.Types.Date, default: Date.now},
  accepted: Boolean,
  ignored: {type: Schema.Types.Boolean, default: false}
});

followRelationSchema.index({user: 1, follows: 1}, {unique: true});

module.exports = mongoose.model("FollowRelation", followRelationSchema);