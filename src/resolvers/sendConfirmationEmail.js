const { AuthenticationError } = require("apollo-server");
const getEmailTransport = require("../helpers/getEmailTransport");

const sendConfirmationEmail = (user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const transport = getEmailTransport();

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "SpokenNetwork Account Confirmation",
      html: `Hello, ${user.name}.<br><br>Welcome to SpokenNetwork!<br>Your account confirmation code is <b>${user.confirmation_code}</b>.<br><br>Best regards,<br>SpokenNetwork Team.`
    }

    transport.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      resolve(info);
    });
  });
}

module.exports = sendConfirmationEmail;