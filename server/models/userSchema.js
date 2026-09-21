const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPassToken: {
      type: String,
    },
    passTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

// middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePasswords = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

module.exports = mongoose.model("user", userSchema);
