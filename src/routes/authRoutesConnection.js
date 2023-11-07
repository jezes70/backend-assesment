const express = require("express");
const router = express.Router();
const registerController = require("../controller/registerController");
const profileController = require("../controller/profileController");
const Login = require("../controller/loginController");
const forgotPasswordController = require("../controller/forgotPasswordController");
const authenticateUser = require("../middlewares/auth");

router.post("/register", registerController.createUser);
router.get("/resend/:email", registerController.resendOtp);
router.get("/view-users/:id", authenticateUser, registerController.getUser);
router.post("/upload-pic", authenticateUser, profileController.uploadPicture);
router.put("/update/:id", authenticateUser, profileController.updateSettings);

router.post("/verify-otp", registerController.verifyUser);
router.post("/login", Login);

router.post(
  "/forgotPassword",
  forgotPasswordController.forgotPasswordController
);
router.post("/change-password", forgotPasswordController.changePassword);
router.get("/all", registerController.getAll);
router.get("/confirm-link", forgotPasswordController.confirm);

module.exports = router;
