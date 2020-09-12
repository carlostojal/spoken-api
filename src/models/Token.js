const mongoose = require("mongoose");
const tokenSchema = require("../schemas/Token");

module.exports = mongoose.model('Token', tokenSchema);
