const mongoose = require("mongoose");
const postSchema = require("../schemas/Post");

module.exports = mongoose.model('Post', postSchema);
