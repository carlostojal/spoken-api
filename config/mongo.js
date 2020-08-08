const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(`${process.env.MONGODB_HOST}/spokennetwork`, { useUnifiedTopology: true }, (err, db) => {
  if (err) throw err;
  console.log("Database created.");
  const dbo = db.db("spokennetwork");
  console.log("Creating collections...");
  dbo.createCollection("users", { strict: true }, (err, res) => {
    if(err)
      console.log("Users collection already exists. Skipped.");
    else
      console.log("Users collection created.");
  });
  dbo.createCollection("posts", { strict: true }, (err, res) => {
    if(err)
      console.log("Posts collection already exists. Skipped.");
    else
      console.log("Posts collection created.");
  });
  db.close();
});
