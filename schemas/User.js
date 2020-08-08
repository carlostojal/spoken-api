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
  birthdate: Number, // epoch time of birth day
  email: String,
  email_confirmed: Boolean,
  username: String,
  password: String,
  profile_pic_url: String,
  profile_type: String // "public" or "private"
});

