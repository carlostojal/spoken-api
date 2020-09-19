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
      _id: user._id,
      name: user.name,
      surname: user.surname,
      username: user.username
    }
  }, process.env.TOKEN_SECRET);

  return { user: user._id, value: token, createdAt: Date.now(), expiresAt: expiry, type };
}

module.exports = createToken;
