const express = require("express");

const {
  checkOut,
  getMyOrders,
  getOrderById,
} = require("../controllers/order.controller");
const { antiAdminMiddleware } = require("../middleware/antiAdminMiddleware");

const route = express.Router();

route.post("/checkout", antiAdminMiddleware, checkOut);
route.get("/my-orders", antiAdminMiddleware, getMyOrders);
route.get("/:id", getOrderById);
module.exports = route;
