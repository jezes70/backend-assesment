const dotenv = require("dotenv");
dotenv.config();

const sendOtp = (to, message, res) => {
  return new Promise((resolve, reject) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = "+13343263368";

    const twilio = require("twilio")(accountSid, authToken);
    const toWithoutFirstDigit = `+234${to.slice(1)}`;

    twilio.messages
      .create({
        body: message,
        from: toWithoutFirstDigit,
        to: to,
      })
      .then((message) => {
        console.log("SMS sent:", message.sid);
        resolve("SMS sent successfully");
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        // return res.status(400).json({ Error: errorMessage });

        reject("Error sending SMS");
      });
  });
};

module.exports = {
  sendOtp,
};
