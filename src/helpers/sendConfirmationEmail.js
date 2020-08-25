const getEmailTransport = require("./getEmailTransport");

const sendConfirmationEmail = (user) => {
  return new Promise((resolve, reject) => {
    const transport = getEmailTransport();

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "SpokenNetwork Account Confirmation",
      html: `Hello, ${user.name}.<br><br>Welcome to SpokenNetwork!`
    }

    transport.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);

      resolve(info);
    });
  });
}

module.exports = sendConfirmationEmail;