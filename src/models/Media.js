const mongoose = require("mongoose");
const mediaSchema = require("../schemas/Media");

module.exports = mongoose.model('Media', mediaSchema);
