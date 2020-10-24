const getToken = require("../src/resolvers/getToken");
require("dotenv").config({ path: ".env" });
const mysqlClient = require("../src/config/mysql");
const redisClient = require("../src/config/redis");

test("Get token for user not existent", () => {
  return expect(getToken("i_dont_exists", "test", null, null, null, mysqlClient, redisClient)).rejects.toThrowError(new Error("USER_NOT_FOUND"));
});

test("Get token with wrong password", () => {
  return expect(getToken("test", "test", null, null, null, mysqlClient, redisClient)).rejects.toThrowError(new Error("WRONG_PASSWORD"));
});

test("Get token with right password", () => {
  return expect(getToken("test", "@Password123", null, null, null, mysqlClient, redisClient)).resolves.toBeDefined();
});