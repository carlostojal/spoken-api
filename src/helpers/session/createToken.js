const jwt = require("jsonwebtoken");

const createToken = (user, type = "access") => {

  let expiry;

  if(type == "access")
    expiry = Math.floor(Date.now() / 1000) + (60 * process.env.ACCESS_TOKEN_DURATION);
  else
    expiry = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * process.env.REFRESH_TOKEN_DURATION);

  const token = jwt.sign({
    exp: expiry,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      username: user.username
    }
  }, type == "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET);

  return { user: user._id, value: token, createdAt: Date.now(), expiresAt: expiry * 1000, type };
}

module.exports = createToken;
