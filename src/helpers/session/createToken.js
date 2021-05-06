const jwt = require("jsonwebtoken");

const createToken = (user, type = "access") => {

  let expiry;

  if(type == "access")
    expiry = (Math.floor(Date.now() / 1000) + (60 * process.env.ACCESS_TOKEN_DURATION)) * 1000;
  else
    expiry = (Math.floor(Date.now() / 1000) + (60 * 60 * 24 * process.env.REFRESH_TOKEN_DURATION)) * 1000;

  const token = jwt.sign({
    exp: expiry,
    user: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      username: user.username
    }
  }, type == "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET);

  return { user: user._id, value: token, created_at: Date.now(), expires_at: expiry, type };
}

module.exports = createToken;
