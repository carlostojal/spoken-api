const mongoose = require("mongoose");
const postSchema = require("../schemas/PostComment");

module.exports = mongoose.model('PostComment', postSchema);
