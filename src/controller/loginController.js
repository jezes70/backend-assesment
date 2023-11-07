const express = require("express");
const User = require("../models/userModels");
const { loginUserSchema, variables } = require("../utils/utils");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/notifications");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationResult = loginUserSchema.validate(req.body, variables);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.status) {
        const validUser = await bcrypt.compare(password, user.password);

        if (validUser) {
          const token = await generateToken(user);
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 60 * 60 * 1000,
          });
          return res.status(200).json({ token: token, user: user });
        } else {
          return res
            .status(400)
            .json({ error: "Invalid email/phone number or password" });
        }
      } else {
        res.status(404).json({
          error: "Invalid email Or Unauthorized User",
        });
      }
    } else {
      res.status(404).json({
        error: "User Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Internal server error" });
  }
};

module.exports = Login;
