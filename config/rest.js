const express = require("express");
const cookieParser = require("cookie-parser");

console.log("Starting REST server...");

const app = express();

app.use(cookieParser());

app.post("/refresh-token", (req, res) => {
  res.cookie("refresh_token", 1234);
});

app.listen(process.env.REST_PORT, () => {
  console.log("REST server started.\n");
})
