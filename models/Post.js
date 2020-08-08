const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = require("../schemas/Post");

module.exports = mongoose.model('Post', postSchema);
