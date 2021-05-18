const mongoose = require("mongoose");

let url = null;
if(process.env.MONGO_HOST == "localhost")
  url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin&retryWrites=true&w=majority`;
else
  url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?authSource=admin&retryWrites=true&w=majority`;

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