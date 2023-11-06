const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { portname, hostname, username, password } = require("../config");
const dotenv = require("dotenv");
const jwtSecret = process.env.JWT_SECRET;

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 5 * 60 * 1000);
  return { otp, expiry };
};

const sendRegOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: 587,
      auth: {
        user: process.env.sendinblue_user,
        pass: process.env.sendinblue_pass,
      },
    });

    const mailOptions = {
      from: "Voyeja <noreply@voyeja.com>",
      to: email,
      subject: "Account Verification OTP",
      html: `
        <div style="max-width:700px; font-size:110%; border:10px solid #ddd; 
        padding:50px 20px; margin:auto; ">
        <h2 style="text-transform:uppercase; text-align:center; color:teal;">
          Welcome to E-AID
        </h2>
        <p>Hi there, your OTP is ${otp.otp}, and it will expire in 30 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending account verification OTP");
  }
};

const sendPasswordResetOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: 587,
      auth: {
        user: process.env.sendinblue_user,
        pass: process.env.sendinblue_pass,
      },
    });

    const mailOptions = {
      from: "Voyeja <noreply@voyeja.com>",
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="max-width:700px; font-size:110%; border:10px solid #ddd; 
        padding:50px 20px; margin:auto; ">
        <p>Your OTP to reset your password is:</p>
        <h1>${otp}</h1>
        <p>Please enter this OTP to reset your password.</p>
        <p>Note that the OTP is only valid for 30 minutes.</p>
        <p>If you did not make this request, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw Error("Error sending password reset OTP");
  }
};

const generateToken = async (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "30min",
    });
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating password reset token");
  }
};

const validateToken = async (user, token) => {
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken.id !== user._id || decodedToken.email !== user.email) {
      return false;
    }
    const expiry = new Date(decodedToken.expiry);
    if (expiry.getTime() < new Date().getTime()) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const generateResetPasswordLink = async (user, req) => {
  const payload = {
    id: user._id,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "5min",
    });
    const transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: 587,
      auth: {
        user: process.env.sendinblue_user,
        pass: process.env.sendinblue_pass,
      },
    });
    const link = `http://${req.hostname}:8080/api/v1/confirm-link?token=${token}`;
    console.log(link);

    const mailOptions = {
      from: "Voyeja <noreply@voyeja.com>",
      to: user.email,
      subject: "Account Verification OTP",
      html: `
          <div style="max-width:700px; font-size:110%; border:10px solid #ddd; 
          padding:50px 20px; margin:auto; ">
          <h2 style="text-transform:uppercase; text-align:center; color:teal;">
           
          </h2>
          <p>Hi there, your OTP is <a href="${link}">${link},</a> and it will expire in 30 minutes.</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    return link;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating password reset token");
  }
};

module.exports = {
  generateOtp,
  sendRegOTP,
  sendPasswordResetOTP,
  generateToken,
  validateToken,
  generateResetPasswordLink,
};
