require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./router");
var cookieParser = require("cookie-parser");
const cloudinaryConfig = require("./services/CloudinaryConfig");

// for nested values like nested variants
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
dbConfig();
cloudinaryConfig();
app.use(route);
// const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000);
// };

// console.log(generateOTP());
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
