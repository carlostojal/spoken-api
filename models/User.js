const mongoose = require("mongoose");
const Schema = mongoose.Shema;

const userSchema = new Schema({
  name: String,
  surname: String,
  birthdate: Number, // epoch time of birth day
  email: String,
  email_confirmed: Boolean,
  username: String,
  profile_pic_url: String,
  profile_type: String // "public" or "private"
});

exports.User = mongoose.model('User', userSchema);
