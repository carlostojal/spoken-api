const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  surname: String,
  birthdate: String, // epoch time of birth day
  email: {
    type: String,
    unique: true
  },
  email_confirmed: Boolean,
  confirmation_code: Number,
  username: {
    type: String,
    unique: true
  },
  password: String,
  profile_pic_media: { type: Schema.ObjectId, ref: 'Media' },
  profile_type: String, // "personal" or "business"
  profile_privacy_type: String, // "public" or "private"
});

