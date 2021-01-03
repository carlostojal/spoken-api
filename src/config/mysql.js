const mysql = require("mysql");

module.exports = new Promise((resolve, reject) => {
  console.log("Connecting MySQL Client.");

  const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: "utf8mb4"
  });

  con.connect((err) => {
    if (err) return reject(err);

    return resolve(con);
  });
});