const mongoose = require("mongoose");
const dbConfig = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB Connected!"));
};
module.exports = dbConfig;
