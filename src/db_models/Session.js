const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationPointSchema = require("./LocationPointSchema");

const sessionSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  token: String,
  created_at: {type: Schema.Types.Date, default: Date.now},
  expires_at: Date,
  user_platform: String,
  user_location: {
    type: LocationPointSchema,
    index: "2dsphere"
  }
});

module.exports = mongoose.model("Session", sessionSchema);