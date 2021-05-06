const bcrypt = require("bcrypt");
const getEmailTransport = require("../helpers/getEmailTransport");
const User = require("../db_models/User");

const sendConfirmationEmail = (username, password) => {
  return new Promise(async (resolve, reject) => {

    let user = null;
    try {
      user = await User.findOne({$or: [
        {username: username},
        {email: username}
      ]});
    } catch(e) {
      console.error(e);
      return reject(new Error("ERROR_GETTING_USER"));
    }

    let redisClient;
    try {
      redisClient = await require("../config/redis");
    } catch(e) {
      return reject("CONNECTION_ERROR");
    }

    redisClient.exists(`confirmation_email:${user.id}`, (error, exists) => {

      if(error)
        return reject(new Error("ERROR_CHECKING_TIMEOUT"));

      if(exists)
        return reject(new Error("ON_TIMEOUT"));

      bcrypt.compare(password, user.password, (err, success) => {

        if(err)
          return reject(new Error("AUTH_ERROR"));
  
        if(!success)
          return reject(new Error("BAD_AUTHENTICATION"));
  
        const transport = getEmailTransport();
  
        const mailOptions = {
          from: process.env.EMAIL_ADDRESS,
          to: user.email,
          subject: "Spoken Account Confirmation",
          html: `Hello, ${user.name}.<br><br>Welcome to Spoken!<br>Your account confirmation code is <b>${user.confirmation_code}</b>.<br><br>Best regards,<br>Spoken Team.`
        }
    
        transport.sendMail(mailOptions, (err, info) => {

          if (err) return reject(new Error("ERROR_SENDING_EMAIL"));
    
          return resolve(null);
        });

        redisClient.set(`confirmation_email:${user.id}`, 1, "EX", process.env.CONFIRMATION_EMAIL_TIMEOUT);
      });
    });
  });
}

module.exports = sendConfirmationEmail;