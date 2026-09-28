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
  signOut,
  getAllUsersForAdmin,
  updateUserRole,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const route = express.Router();

route.post("/signup", signUp);
route.post("/verifyotp", verifyOtp);
route.post("/resendotp", resendOtp);
route.post("/signin", signIn);
route.post("/forgetpassword", forgetPassword);
route.post("/resetpass/:token", resetPassword);
route.get("/profile", authMiddleware, getUserProfile);
route.put(
  "/updateprofile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile,
);
route.post("/refreshaccesstoken", refreshAccessToken);
route.post("/signout", signOut);

route.get(
  "/userlist",
  authMiddleware,
  roleCheckMiddleware("admin"),
  getAllUsersForAdmin,
);
route.patch(
  "/updaterole/:userId",
  authMiddleware,
  roleCheckMiddleware("admin"),
  updateUserRole,
);

module.exports = route;
