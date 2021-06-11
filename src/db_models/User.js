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
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
  posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
  interests: [{type: Schema.Types.ObjectId, ref: "Tag"}],
  profile_pic: {type: Schema.Types.ObjectId, ref: "Media"},
  profile_privacy_type: String,
  profile_type: String,
  doing_detox: {type: Boolean, default: false},
  sessions: [{type: Schema.Types.ObjectId, ref: "Session"}],
  push_token: String,
  permissions: {
    collect_usage_data: {type: Boolean, default: true}
  }
});

userSchema.index({
  "name": "text",
  "surname": "text",
  "email": "text",
  "username": "text"
});

module.exports = mongoose.model("User", userSchema);