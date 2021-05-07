const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");
const platform = require("platform");
const createToken = require("../helpers/session/createToken");
const User = require("../db_models/User");
const Session = require("../db_models/Session");

const getToken = (username, password, userPlatform, remoteAddress, userAgent, pushToken) => {
  return new Promise(async (resolve, reject) => {

    let user; 

    try {
      user = await User.findOne({$or: [
        {username: username},
        {email: username}
      ]});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    if(!user)
      return reject(new Error("USER_NOT_FOUND"));

    bcrypt.compare(password, user.password, async (err, compareSuccess) => { // compare the provided password with the user one
    
      if (err)
        return reject(new Error("AUTHENTICATION_ERROR"));

      if(!compareSuccess) return reject(new Error("WRONG_PASSWORD"));

      if(!user.email_confirmed) 
        return reject(new Error("EMAIL_NOT_CONFIRMED"));

      /*
      // get user geolocation
      let geo = null;
      try {
        geo = geoip.lookup(remoteAddress);
      } catch(e) {
        
        return reject(new Error("ERROR_GETTING_LOGIN_LOCATION"));
      }*/


      // get user platform
      let platformData = null;
      if(userPlatform) {
        platformData = userPlatform;
      } else {
        try {
          platformData = platform.parse(userAgent);
          platformData = platformData.description;
        } catch(e) {
          console.error(e);
        }
      }

      // create tokens with specified duration and user id
      const refresh_token = createToken(user, "refresh");
      const access_token = createToken(user, "access");

      const session = Session({
        user: user._id,
        token: refresh_token.value,
        expires_at: new Date(refresh_token.expires_at),
        user_platform: platformData
      });

      try {
        await session.save();
      } catch(e) {
        console.error(e);
        return reject(new Error("ERROR_CREATING_SESSION"));
      }

      try {
        user.push_token = pushToken;
        await user.save();
      } catch(e) {
        console.error(e);
      }

      return resolve({ access_token, refresh_token });
    });
  });
}

module.exports = getToken;
