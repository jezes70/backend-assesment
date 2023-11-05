const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  interests: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otp_expiry: {
    type: Date,
    default: null,
  },
  profile: {
    type: String,
    default:
      "https://s.gravatar.com/avatar/fc6ec60e195b1181df3189bf9593f1cb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fje.png",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
