const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  forgetPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  refreshAccessToken,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const route = express.Router();

route.post("/signup", signUp);
route.post("/verifyotp", verifyOtp);
route.post("/resendotp", resendOtp);
route.post("/signin", signIn);
route.post("/forgetpassword", forgetPassword);
route.post("/resetpass/:token", resetPassword);
route.post("/profile", authMiddleware, getUserProfile);
route.put(
  "/updateprofile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile,
);
route.post("/refreshaccesstoken", refreshAccessToken);

module.exports = route;
