require("dotenv").config();

// Importing DB connect
const connectDB = require("./db/connectDB");

// Express App
const express = require("express");
const app = express();
const port = 3000;

// Connecting to Database
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((error) => {
    console.log("Error while connecting to database", error);
  });
