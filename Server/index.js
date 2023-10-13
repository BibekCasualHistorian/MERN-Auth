require("dotenv").config();

// Importing DB connect
const connectDB = require("./db/connectDB");

// Importing Routes
const userRoutes = require("./routes/userRoutes");

// Express App
const express = require("express");
const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// App Routes
app.use("/api/user", userRoutes);

// Error Routes. which now we aren't using
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server problem";
  res.status(status).json({ message, status });
});

// Connecting to Database
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Example app listening on port ${PORT}!`)
    );
  })
  .catch((error) => {
    console.log("Error while connecting to database", error);
  });
