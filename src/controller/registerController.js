const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const User = require("../models/userModels");
const { createUserValidator, isOtpValid } = require("../utils/utils");
const { generateOtp, sendRegOTP } = require("../utils/notifications");
const { sendOtp } = require("../utils/smsService");
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    const { email, phone, password, interests } = req.body;

    const validationResult = createUserValidator.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    const findOneUser = await User.findOne({ email });
    if (findOneUser) {
      return res.status(400).json({
        error: "Email already exists",
        status: findOneUser.status,
      });
    }
    const status = false;

    const otp = generateOtp();

    console.log(otp);
    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
      interests,
      status,
      otp: otp.otp,
      otp_expiry: otp.expiry,
    });
    await newUser.save();
    await otpSend(otp, phone, email, res);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = generateOtp();
    const user = await User.findOne({ email });
    if (user) {
      user.otp = otp.otp;
      user.otp_expiry = otp.expiry;
      await user.save();
      // await otpSend(otp, user.phone, email, res);
      console.log(otp);
      return res.status(200).json({
        otp: otp,
        message: "OTP sent successfully",
      });
    } else {
      return res.status(400).json({
        msg: "Not found",
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

const otpSend = async (otp, to, email, res) => {
  const html = `
    <div style="max-width:700px; font-size:110%; border:10px solid #ddd;
    padding:50px 20px; margin:auto; ">
    <h2 style="text-transform:uppercase; text-align:center; color:teal;">
      Welcome to E-AID
    </h2>
    <p>Hi there, your OTP is ${otp.otp}, and it will expire in 30 minutes.</p>
    </div>
    `;

  // sendOtp(to, html, res);
  await sendRegOTP(email, otp);
};
const getAll = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({
    msg: users,
  });
};

const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const users = await User.findOne({ _id: id });
    if (!users) {
      return res.status(400).json({
        msg: "User not found",
      });
    } else {
      return res.status(200).json({
        msg: users,
      });
    }
  } catch (e) {
    return res.status(400).json({
      msg: e.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please create an account first.",
      });
    }
    if (isOtpValid(user, otp)) {
      user.status = true;
      user.otp = "";
      user.otp_expiry = "";
      await user.save();

      return res
        .status(200)
        .json({ message: "User verified successfully. Proceed to Login." });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid OTP or OTP has expired." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createUser, getAll, verifyUser, resendOtp, getUser };
