const express = require("express");

const multer = require("multer");
const {
  addToCart,
  getUserCart,
  updateCart,
  removeFromCart,
  clearUserCart,
} = require("../controllers/cart.controller");

const route = express.Router();
const upload = multer();

route.post("/addtocart", addToCart);
route.get("/get", getUserCart);
route.put("/update", updateCart);
route.put("/remove", removeFromCart);
route.post("/clear", clearUserCart);

module.exports = route;
