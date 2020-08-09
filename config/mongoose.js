const mongoose = require("mongoose");

console.log("Setting up Mongoose...");
// mongodb connection
mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
console.log("Done.\n");
