const dotenv = require("dotenv").config();

const hostname = String(process.env.smtp_host);
const portname = Number(process.env.smtp_port);
const username = String(process.env.sendinblue_user);
const password = String(process.env.sendinblue_pass);
const jwtsecret = String(process.env.JWT_SECRET);
const CloudName = String(process.env.cloudinary_cloud_name);
const APIKey = String(process.env.cloudinary_api_key);
const APISecret = String(process.env.cloudinary_api_secret);

const accountSid = String(process.env.TWILIO_ACCOUNT_SID);
const authToken = String(process.env.TWILIO_AUTH_TOKEN);

module.exports = {
  hostname,
  portname,
  username,
  password,
  jwtsecret,
  CloudName,
  APIKey,
  APISecret,
  accountSid,
  authToken,
};
