const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const categoryRoute = require("./category");
const productRoute = require("./product");
const cartRoute = require(".//cart");
const orderRoute = require("./order");
const { authMiddleware } = require("../middleware/authMiddleware");
route.get("/", (req, res) => {
  res.send("server route");
});
route.use("/auth", authRoute);
route.use("/product", productRoute);
route.use("/category", categoryRoute);
route.use("/cart", authMiddleware, cartRoute);
route.use(authMiddleware, orderRoute);
module.exports = route;
