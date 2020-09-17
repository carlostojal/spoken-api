const { AuthenticationError } = require("apollo-server");
const getEmailTransport = require("./getEmailTransport");

const sendConfirmationEmail = (user) => {
  return new Promise((resolve, reject) => {

    if(!user)
      return reject(new AuthenticationError("BAD_AUTHENTICATION"));

    const transport = getEmailTransport();

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "SpokenNetwork Account Confirmation",
      html: `Hello, ${user.name}.<br><br>Welcome to SpokenNetwork!<br>Click <a href="${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/confirm?uid=${user._id}&confirmation_code=${user.confirmation_code}">this</a> to confirm your account.<br><br>Best regards,<br>SpokenNetwork Team.`
    }

    transport.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      resolve(info);
    });
  });
}

module.exports = sendConfirmationEmail;