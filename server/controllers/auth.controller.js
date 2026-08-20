const userSchema = require("../models/userSchema");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../services/CloudinaryService");
const cloudinary = require("cloudinary").v2;
const { sentVerificationEmail } = require("../services/emailServices");
const { emailVerifyTemp, resetPassTemp } = require("../services/emailTemp");
const {
  generateOTP,
  generateAccTok,
  generateRefreshTok,
  generateResetPassToken,
  verifyToken,
  hashVerifyResetPassToken,
} = require("../services/helper");
const sendResponse = require("../services/sendResponse");
const { isValidEmail, isValidPass } = require("../services/validation");

const signUp = async (req, res) => {
  try {
    const { fullname, email, password, address, phone } = req.body;

    if (!fullname) return sendResponse(res, 400, "Name is required");
    if (!email) return sendResponse(res, 400, "Email is required");
    // res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email)) return sendResponse(res, 400, "Invalid email");
    // res.status(400).send({ message: "Invalid email" });

    if (!password) return sendResponse(res, 400, "Password is required");
    // res.status(400).send({ message: "Password is required" });
    if (!isValidPass(password))
      return sendResponse(
        res,
        400,
        "Minimum 8 character is required for password",
      );
    // res
    //   .status(400)
    //   .send({ message: "Minimum 8 character is required for password" });

    const existUser = await userSchema.findOne({ email });
    if (existUser)
      return sendResponse(res, 400, "User with this email already exists");
    // res .status(400).send({ message: "User with this email already exists" });

    const OTP = generateOTP();
    //   saving into the dataBase
    const user = new userSchema({
      fullname,
      email,
      password,
      address,
      phone,
      otp: OTP,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    await sentVerificationEmail({
      email: email,
      subject: "Email verification",
      parameter: OTP,
      temp: emailVerifyTemp,
    });

    await user.save();
    return sendResponse(
      res,
      200,
      "verification code has been sent to your email",
    );

    // res.status(200).send({ message: "verification code has been sent to your email" });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};

// verifying otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");
    if (!otp) return sendResponse(res, 400, "OTP is required");

    const user = await userSchema.findOne({
      email,
      otp: otp,
      otpExpires: { $gt: Date.now() },
      isVerified: false,
    });

    if (!user) {
      return sendResponse(
        res,
        400,
        "Invalid OTP, expired, or account already verified.",
      );
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    return sendResponse(res, 200, "Account verified successfully!");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");

    const user = await userSchema.findOne({ email, isVerified: false });
    if (!user)
      return sendResponse(res, 400, "User not found or already verified");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sentVerificationEmail({
      email: email,
      subject: "Email verification",
      parameter: otp,
      temp: emailVerifyTemp,
    });

    return sendResponse(res, 200, "A new OTP has been sent to your email");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");
    if (!password) return sendResponse(res, 400, "Password is required");

    const existUser = await userSchema.findOne({ email });
    if (!existUser)
      return sendResponse(res, 404, "User with this email does not exist");

    // Check if the user is verified before allowing them to login
    if (!existUser.isVerified) {
      return sendResponse(
        res,
        401,
        "Please verify your email before signing in",
      );
    }

    const passwordCheck = await existUser.comparePasswords(password);
    if (!passwordCheck) return sendResponse(res, 400, "Wrong password");

    const acc_token = generateAccTok(existUser);
    const REF_token = generateRefreshTok(existUser);
    // console.log("acc_Tok :", acc_token);
    // console.log("REF_Tok :", REF_token);
    res.cookie("X-AS-Token", acc_token, {
      maxAge: 172800000, // 48 hours
      httpOnly: false, // Security: prevent JS access
      secure: false, // Security: HTTPS only
      // sameSite: "lax", // CSRF protection
    });
    res.cookie("X-RF-Token", REF_token, {
      maxAge: 12966000000, // 15 days
      httpOnly: false, // Security: prevent JS access
      secure: false, // Security: HTTPS only
      // sameSite: "lax", // CSRF protection
    });
    return sendResponse(res, 200, "Sign in successful", {
      userId: existUser._id,
      fullname: existUser.fullname,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");
    if (!isValidEmail(email)) return sendResponse(res, 400, "Invalid email");

    const existUser = await userSchema.findOne({ email });
    if (!existUser)
      return sendResponse(res, 404, "User with this email does not exist");

    const { plainResetToken, hashedToken } = generateResetPassToken();
    const resetPassLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/auth/resetpass/${plainResetToken}`;

    // saving into the Database
    existUser.resetPassToken = hashedToken;
    existUser.passTokenExpires = Date.now() + 2 * 60 * 1000;
    await existUser.save();

    await sentVerificationEmail({
      email: email,
      subject: "Reset Password",
      parameter: resetPassLink,
      temp: resetPassTemp,
    });
    return sendResponse(
      res,
      200,
      "A password reset link has been sent to your email address. Please check your inbox.",
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal server error");
  }
};
const resetPassword = async (req, res) => {
  try {
    const { newpassword } = req.body;
    const { token } = req.params;
    console.log("plain token :", token);
    if (!newpassword) return sendResponse(res, 400, "New Password is required");
    if (!token) return sendResponse(res, 400, "page not found");
    const hashedToken = hashVerifyResetPassToken(token);
    console.log("hashedToken : ", hashedToken);
    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      passTokenExpires: { $gt: Date.now() },
    });
    if (!existingUser)
      return sendResponse(res, 404, "Token expired or invalid token");

    existingUser.password = newpassword;
    existingUser.resetPassToken = undefined;
    existingUser.passTokenExpires = undefined;

    await existingUser.save();

    return sendResponse(
      res,
      200,
      "Password reset successful. You can now login.",
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal server error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    // console.log("user :", user);
    const userProfile = await userSchema
      .findById(user._id)
      .select("-password -otp -updatedAt -isVerified -otpExpires");
    if (!userProfile) return sendResponse(res, 404, "User not found");

    return sendResponse(
      res,
      200,
      "welcome. Profile fetched successfully",
      userProfile,
    );
  } catch (error) {
    console.error("Get Profile Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, phone, address } = req.body;
    const userId = req.user._id;
    const avatar = req.file;

    console.log("avatar :", req.file);

    const userProfile = await userSchema
      .findById(userId)
      .select("-password -otp -updatedAt -isVerified -otpExpires");
    if (!userProfile) return sendResponse(res, 404, "User not found");

    // deleting img from cloud
    if (avatar) {
      if (userProfile.avatar) {
        const cloudImgPub_id = userProfile.avatar
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinaryDelete(`avatar/${cloudImgPub_id}`);
      }
      // uploading img to cloud
      const cloudRes = await cloudinaryUpload(avatar, "avatar");
      userProfile.avatar = cloudRes.secure_url;
      console.log("cloudRes :", cloudRes);
    }
    if (fullname) userProfile.fullname = fullname;
    if (phone) userProfile.phone = phone;
    if (address) userProfile.address = address;

    await userProfile.save();
    return sendResponse(res, 200, "Profile Updated successfully", userProfile);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.["X-RF-Token"] || req.headers.authorization;

    if (!refreshToken) {
      return sendResponse(res, 400, "Refresh token missing");
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) return (res, 400, "unauthorized request");

    const accessToken = generateAccTok(decoded);

    res
      .cookie("X-AS-Token", accessToken, {
        maxAge: 172800000, // 48 hours
        httpOnly: false, // Security: prevent JS access
        secure: false, // Security: HTTPS only
        // sameSite: "lax", // CSRF protection
      })
      .send({ success: true });
  } catch (error) {
    console.error("refreshAccessToken Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  forgetPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  refreshAccessToken,
};
