const redis = require("redis");

console.log("Starting Redis client...");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis client connected.\n");
})

client.on("error", (error) => {
  console.error(error);
});

if(process.env.CLEAR_CACHE_ON_STARTUP == "true") {
  console.log("Cache cleared.");
  client.flushall((error, success) => {
    if (error) console.error(error);
  });
}

module.exports = client;