const getEmailTransport = require("./getEmailTransport");

const sendLoginApprovalEmail = (user, location, token_id) => {
  return new Promise((resolve, reject) => {
    const transport = getEmailTransport();

    const location_details = location ? `${location.city}, ${location.country}` : "an unknown location";

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "SpokenNetwork Login Approval",
      html: `Hello, ${user.name}.<br><br>Looks like you tried to login from ${location_details}. If it was not you, ignore this.<br>Else, click <a href="${process.env.EXPRESS_ADDRESS}:${process.env.EXPRESS_PORT}/approve?sessid=${token_id}">this</a> to approve your login. Sorry for the inconvenience, but you safety is a priority.<br><br>Best regards,<br>SpokenNetwork Team.`
    }

    transport.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      resolve(info);
    });
  });
}

module.exports = sendLoginApprovalEmail;