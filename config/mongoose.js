const mongoose = require("mongoose");

console.log("Connecting to MongoDB...");
// mongodb connection
mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connected.\n");
