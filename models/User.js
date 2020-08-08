const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("../schemas/User");

module.exports = mongoose.model('User', userSchema);
