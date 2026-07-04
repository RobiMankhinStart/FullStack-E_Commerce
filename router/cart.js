const express = require("express");

const multer = require("multer");
const {
  addToCart,
  getUserCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cart.controller");

const route = express.Router();
const upload = multer();

route.post("/addtocart", addToCart);
route.get("/get", getUserCart);
route.put("/update", updateCart);
route.put("/remove", removeFromCart);

module.exports = route;
