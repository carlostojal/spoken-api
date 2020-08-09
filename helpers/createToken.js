const jwt = require("jsonwebtoken");

const createToken = (uid, type = "access") => {

  let expiry;

  if(type == "access")
    expiry = Date.now() + (60 * process.env.ACCESS_TOKEN_DURATION * 1000);
  else
    expiry = Date.now() + (60 * 60 * 24 * process.env.REFRESH_TOKEN_DURATION * 1000);

  const token = jwt.sign({
    exp: expiry,
    data: {
      user_id: uid
    }
  }, process.env.TOKEN_SECRET);

  return { value: token, expiry: expiry };
}

module.exports = createToken;
