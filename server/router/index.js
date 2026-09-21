const express = require("express");
const route = express.Router();
const authRoute = require("./auth");
const categoryRoute = require("./category");
const productRoute = require("./product");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const { authMiddleware } = require("../middleware/authMiddleware");
const { antiAdminMiddleware } = require("../middleware/antiAdminMiddleware");

route.get("/", (req, res) => {
  res.send("server route");
});
route.use("/auth", authRoute);
route.use("/product", productRoute);
route.use("/category", categoryRoute);
route.use("/cart", antiAdminMiddleware, cartRoute);
route.use("/order", authMiddleware, orderRoute);
module.exports = route;
