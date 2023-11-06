const dotenv = require("dotenv");
dotenv.config();

const sendOtp = (to, message) => {
  return new Promise((resolve, reject) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = "+13343263368";

    const twilio = require("twilio")(accountSid, authToken);

    twilio.messages
      .create({
        body: message,
        from: twilioPhoneNumber,
        to: to,
      })
      .then((message) => {
        console.log("SMS sent:", message.sid);
        resolve("SMS sent successfully");
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        reject("Error sending SMS");
      });
  });
};

module.exports = {
  sendOtp,
};
