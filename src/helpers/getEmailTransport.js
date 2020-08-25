const nodemailer = require("nodemailer");

const getEmailTransport = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter;
}

module.exports = getEmailTransport;