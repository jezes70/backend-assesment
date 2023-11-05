const express = require("express");
const router = express.Router();
const registerController = require("../controller/registerController");
const profileController = require("../controller/profileController");
const Login = require("../controller/loginController");
const forgotPasswordController = require("../controller/forgotPasswordController");
const authenticateUser = require("../middlewares/auth");

router.post("/register", registerController.createUser);
router.post("/resend", registerController.resendOtp);
router.post("/upload-pic", authenticateUser, profileController.uploadPicture);
router.put("/update/:id", authenticateUser, profileController.updateSettings);

router.post("/verify-otp", registerController.verifyUser);
router.post("/login", Login);

router.post(
  "/forgotPassword",
  forgotPasswordController.forgotPasswordController
);
router.get("/all", registerController.getAll);
router.get("/confirm-link", forgotPasswordController.confirm);

module.exports = router;
