const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports  = new Schema({
  access_token: {
    value: String,
    expiry: Number
  },
  refresh_token: {
    value: String,
    expiry: Number
  },
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
  profile_pic_url: String,
  profile_type: String // "public" or "private"
});

