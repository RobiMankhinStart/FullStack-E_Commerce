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

const getCookieOptions = (req) => {
  const origin = req.headers.origin || process.env.CLIENT_URL || "";
  const isSecureContext = /^https:/i.test(origin) || process.env.VERCEL === "1";

  return {
    httpOnly: false,
    secure: isSecureContext,
    sameSite: isSecureContext ? "none" : "lax",
    path: "/",
  };
};

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
    const cookieOptions = getCookieOptions(req);

    res.cookie("X-AS-Token", acc_token, {
      ...cookieOptions,
      maxAge: 172800000,
    });
    res.cookie("X-RF-Token", REF_token, {
      ...cookieOptions,
      maxAge: 12966000000,
    });

    return sendResponse(res, 200, "Sign in successful", {
      userId: existUser._id,
      fullname: existUser.fullname,
      role: existUser.role,
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
      process.env.CLIENT_URL ||
      "https://full-stack-client-e-commerce.vercel.app"
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
      req.cookies?.["X-RF-Token"] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!refreshToken) {
      return sendResponse(res, 401, "Refresh token missing or expired");
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) return sendResponse(res, 401, "Unauthorized request");

    const accessToken = generateAccTok(decoded);
    const cookieOptions = getCookieOptions(req);

    res
      .cookie("X-AS-Token", accessToken, {
        ...cookieOptions,
        maxAge: 172800000,
      })
      .send({ success: true });
  } catch (error) {
    console.error("refreshAccessToken Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const signOut = async (req, res) => {
  try {
    const cookieOptions = getCookieOptions(req);

    res.clearCookie("X-RF-Token", cookieOptions);
    res.clearCookie("X-AS-Token", cookieOptions);

    return sendResponse(res, 200, "Signed out successfully");
  } catch (error) {
    console.error("signOut Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Controller to Fetch All Users for Admin
const getAllUsersForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Build dynamic filter query
    const query = {};

    if (role && ["admin", "user", "editor"].includes(role)) {
      query.role = role;
    }

    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { fullname: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Execute query with pagination
    const [users, totalUsers] = await Promise.all([
      userSchema
        .find(query)
        .select("-password -otp -resetPassToken -passTokenExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      userSchema.countDocuments(query),
    ]);

    // Calculate Global Summary Statistics using MongoDB Aggregation
    const summaryData = await userSchema.aggregate([
      {
        $facet: {
          roleCounts: [
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
          ],
          verifiedCounts: [
            {
              $group: {
                _id: "$isVerified",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const roleMap = (summaryData[0]?.roleCounts || []).reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const verifiedMap = (summaryData[0]?.verifiedCounts || []).reduce(
      (acc, curr) => {
        acc[curr._id ? "verified" : "unverified"] = curr.count;
        return acc;
      },
      {},
    );

    const summary = {
      totalUsers,
      adminCount: roleMap["admin"] || 0,
      editorCount: roleMap["editor"] || 0,
      userCount: roleMap["user"] || 0,
      verifiedCount: verifiedMap["verified"] || 0,
      unverifiedCount: verifiedMap["unverified"] || 0,
    };

    const totalPages = Math.ceil(totalUsers / limitNum) || 1;
    const pagination = {
      totalUsers,
      currentPage: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    return sendResponse(res, 200, "Users fetched successfully", {
      users,
      summary,
      pagination,
    });
  } catch (error) {
    console.error("getAllUsersForAdmin Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Controller to Update User Role by Admin
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "user", "editor"];
    if (!role || !allowedRoles.includes(role)) {
      return sendResponse(
        res,
        400,
        "Invalid role. Must be one of: admin, editor, user",
      );
    }

    const targetUser = await userSchema.findById(userId);
    if (!targetUser) {
      return sendResponse(res, 404, "User not found");
    }

    // STRICT BUSINESS RULE:
    // Once a user is an admin, no admin can demote them to user or editor
    if (targetUser.role === "admin" && role !== "admin") {
      return sendResponse(
        res,
        403,
        "Action forbidden: Existing Admin accounts cannot be demoted to user or editor.",
      );
    }

    targetUser.role = role;
    await targetUser.save();

    const updatedUser = targetUser.toObject();
    delete updatedUser.password;
    delete updatedUser.otp;

    return sendResponse(
      res,
      200,
      `User role updated to ${role} successfully`,
      updatedUser,
    );
  } catch (error) {
    console.error("updateUserRole Error:", error);
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
  signOut,
  getAllUsersForAdmin,
  updateUserRole,
};
