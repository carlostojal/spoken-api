const redis = require("redis");

module.exports = new Promise((resolve, reject) => {
  console.log("Starting Redis client...");

  const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  client.auth(process.env.REDIS_PASSWORD)

  client.on("connect", () => {
    console.log("Redis client connected.\n");
    return resolve(client);
  })

  client.on("error", (error) => {
    if(error)
      return reject(error);
  });

  if(process.env.CLEAR_CACHE_ON_STARTUP == "true") {
    console.log("Cache cleared.");
    client.flushall((error, success) => {
      if(error) {
        console.error(error);
      }
    });
  }
});