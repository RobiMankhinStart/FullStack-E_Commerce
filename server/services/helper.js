var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateOTP = () => {
  // Generates a random integer between 1000 and 9999
  return Math.floor(1000 + Math.random() * 9000);
};

// console.log(generateOTP());
const generateAccTok = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },

    process.env.JWT_SEC,
    { expiresIn: "1h" },
  );
};
const generateRefreshTok = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },

    process.env.JWT_SEC,
    { expiresIn: "15d" },
  );
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  return decoded;
};

const generateResetPassToken = () => {
  // return Buffer.from(`${JSON.stringify(user)}`).toString("base64");
  const plainResetToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainResetToken)
    .digest("hex");
  return { plainResetToken, hashedToken };
};

const hashVerifyResetPassToken = (token) => {
  // return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  return crypto.createHash("sha256").update(token).digest("hex");
};
module.exports = {
  generateOTP,
  generateAccTok,
  generateRefreshTok,
  verifyToken,
  generateResetPassToken,
  hashVerifyResetPassToken,
};
