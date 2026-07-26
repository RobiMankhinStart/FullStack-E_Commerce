const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
} = require("../controllers/product.controller");
const route = express.Router();
const upload = multer();

route.post(
  "/createproduct",
  authMiddleware,
  roleCheckMiddleware("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
route.get("/productlist", getAllProducts);

route.get("/:slug", getProductDetails);

route.put(
  "/updateproduct/:slug",
  authMiddleware,
  roleCheckMiddleware("admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct,
);
module.exports = route;
