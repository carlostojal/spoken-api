const getToken = require("../src/resolvers/getToken");
require("dotenv").config({ path: ".env" });
const mysqlClient = require("../src/config/mysql");
const redisClient = require("../src/config/redis");

test("User authentication", () => {
  return expect(getToken("test", "test", null, null, null, mysqlClient, redisClient)).rejects.toThrowError(new Error("USER_NOT_FOUND"));
});