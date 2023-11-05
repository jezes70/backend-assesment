const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectToMongo = require("./config/config");
const authRoutesConnection = require("./routes/authRoutesConnection");

const app = express();
connectToMongo()
  .then(() => {})
  .catch((err) => {
    console.log("Error connecting to database:", err.message);
  });

app.use(bodyParser.json());
app.use(express.json());
app.use("/api/v1/", authRoutesConnection);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
