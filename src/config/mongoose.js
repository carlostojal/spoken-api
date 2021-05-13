const mongoose = require("mongoose");

const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin&retryWrites=true&w=majority`;

try {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
} catch(e) {
  console.error(e);
  throw new Error("ERROR_CONNECTION_TO_MONGODB");
}