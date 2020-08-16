const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  access_tokens: [{
    value: String,
    expiry: Number
  }],
  refresh_tokens: [{
    value: String,
    expiry: Number
  }],
  name: String,
  surname: String,
  birthdate: String, // epoch time of birth day
  email: {
    type: String,
    unique: true
  },
  email_confirmed: Boolean,
  username: {
    type: String,
    unique: true
  },
  password: String,
  profile_pic_media: [{ type: Schema.ObjectId, ref: 'Media' }],
  profile_privacy_type: String, // "public" or "private"
  posts: [{ type: Schema.ObjectId, ref: 'Post' }],
  following: [{ type: Schema.ObjectId, ref: 'FollowRelation' }],
  followers: [{ type: Schema.ObjectId, ref: 'FollowRelation' }],
});

