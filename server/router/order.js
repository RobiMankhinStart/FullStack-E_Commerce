const express = require("express");

const {
  checkOut,
  getMyOrders,
  getOrderById,
  getAllOrdersForAdmin,
  updateOrderStatus,
  getDashboardStats,
} = require("../controllers/order.controller");
const { antiAdminMiddleware } = require("../middleware/antiAdminMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");

const route = express.Router();

route.get(
  "/orderlist",
  roleCheckMiddleware("admin", "editor"),
  getAllOrdersForAdmin,
);

route.get(
  "/dashboard-stats",
  roleCheckMiddleware("admin", "editor"),
  getDashboardStats,
);

// Admin / Editor status update
route.patch(
  "/update-status/:id",
  roleCheckMiddleware("admin", "editor"),
  updateOrderStatus,
);
route.post("/checkout", antiAdminMiddleware, checkOut);
route.get("/my-orders", antiAdminMiddleware, getMyOrders);
route.get("/:id", getOrderById);
module.exports = route;
