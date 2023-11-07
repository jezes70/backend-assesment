const User = require("../models/userModels");
const {
  generateOtp,
  sendRegOTP,
  sendPasswordResetOTP,
  generateResetPasswordLink,
  validateToken,
} = require("../utils/notifications");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jwtSecret = process.env.JWT_SECRET;

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = await generateResetPasswordLink(user, req);

    return res
      .status(200)
      .json({ message: "link sent successfully", link: resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const confirm = async (req, res) => {
  try {
    const token = req.query.token;

    const verified = jwt.verify(token, jwtSecret);

    if (!verified) {
      return res.status(400).json({ expired: true });
    } else {
      const userId = verified.id;
      return res.status(201).json({ expired: false, userId: userId });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { forgotPasswordController, confirm, changePassword };
