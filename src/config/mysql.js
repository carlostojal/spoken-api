const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  charset: "utf8mb4"
});

pool.on("acquire", ({ threadId }) => {
  // console.log(`MySQL connection with ID ${threadId} acquired.`)
});

pool.on("release", ({ threadId }) => {
  // console.log(`MySQL connection with ID ${threadId} released.`);
});

console.log("MySQL Pool created.");

module.exports = pool;