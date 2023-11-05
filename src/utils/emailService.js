const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "your-email-service-provider",
  auth: {
    user: "your-email-username",
    pass: "your-email-password",
  },
});

module.exports = {
  sendEmail: (to, subject, message) => {
    const mailOptions = {
      from: "your-email-sender",
      to,
      subject,
      text: message,
    };

    return transporter.sendMail(mailOptions);
  },
};
