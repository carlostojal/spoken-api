const mongoose = require("mongoose");

console.log("Setting up Mongoose...");
mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
console.log("Done.\n");
