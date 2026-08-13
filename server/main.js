require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./router");
var cookieParser = require("cookie-parser");
const cloudinaryConfig = require("./services/CloudinaryConfig");
const { stripeWebhook } = require("./controllers/webhook.controler");

// 1. STRIPE WEBHOOK ROUTE (Must be defined before express.json)
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// for nested values like nested variants
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
dbConfig();
cloudinaryConfig();
app.use(express.json());
app.use(route);

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
