require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./router");
var cookieParser = require("cookie-parser");
const cloudinaryConfig = require("./services/CloudinaryConfig");
const { stripeWebhook } = require("./controllers/webhook.controler");

// 1. STRIPE WEBHOOK ROUTES (Must be defined before express.json)
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
app.post(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// for nested values like nested variants
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// 2. CORS CONFIGURATION (Supports multiple origins)
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ""),
  "https://full-stack-client-e-commerce.vercel.app",
  "https://full-stack-e-commerce-fawn-delta.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowedVercelPreview = /https:\/\/.*\.vercel\.app$/.test(
        normalizedOrigin,
      );

      if (allowedOrigins.includes(normalizedOrigin) || isAllowedVercelPreview) {
        return callback(null, normalizedOrigin);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-AS-Token",
      "X-RF-Token",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
  }),
);
dbConfig().catch((error) => {
  console.error("Database connection failed:", error.message || error);
});
cloudinaryConfig();
app.use(express.json());

// Root test route to verify server status in browser
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "E-Commerce API is running successfully on Vercel!" });
});
app.use(route);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}
