const express = require("express");

const {
  checkOut,
  getMyOrders,
  getOrderById,
} = require("../controllers/order.controller");

const route = express.Router();

route.post("/checkout", checkOut);
route.get("/my-orders", getMyOrders);
route.get("/:id", getOrderById);
module.exports = route;
