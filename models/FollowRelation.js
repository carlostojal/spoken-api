const mongoose = require("mongoose");
const followRelationSchema = require("../schemas/FollowRelation");

module.exports = mongoose.model('FollowRelation', followRelationSchema);
