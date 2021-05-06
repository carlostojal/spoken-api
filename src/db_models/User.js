const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  birthdate: Date,
  email: {type: Schema.Types.String, unique: true},
  email_confirmed: Boolean,
  confirmation_code: Number,
  username: {type: Schema.Types.String, unique: true, required: true},
  password: String,
  profile_pic: {type: Schema.Types.ObjectId, ref: "Media"},
  profile_privacy_type: String,
  profile_type: String,
  push_token: String
});

module.exports = mongoose.model("User", userSchema);