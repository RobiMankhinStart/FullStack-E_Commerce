const express = require("express");
const multer = require("multer");
const upload = multer();

const { authMiddleware } = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const {
  createCategory,
  getALlCategories,
} = require("../controllers/category.controller");
const route = express.Router();

route.post(
  "/create",
  authMiddleware,
  roleCheckMiddleware("admin"),
  upload.single("thumbnail"),
  createCategory,
);
route.get("/all", getALlCategories);

module.exports = route;
