const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  value: String,
  createdAt: String,
  expiresAt: String,
  userLocation: String,
  userPlatform: String,
  approved: Boolean, // defines if the login is safe / unsafe but approved
  approvalCode: Number // code to approve unsafe logins
});