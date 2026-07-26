const express = require("express");

const { checkOut } = require("../controllers/order.controller");

const route = express.Router();

route.post("/checkout", checkOut);

module.exports = route;
