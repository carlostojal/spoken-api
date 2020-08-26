const mongoose = require("mongoose");
const postSchema = require("../schemas/PostReaction");

module.exports = mongoose.model('PostReaction', postSchema);
