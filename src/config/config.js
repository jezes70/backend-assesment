const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToMongo() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      //   useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = connectToMongo;
