const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;

// Connect to your MongoDB database

// Create an instance of your mongoose schema and model
// const MyModel = mongoose.model(
//   "MyModel",
//   new mongoose.Schema({
//     // Your schema definition here
//   })
// );

// Create the indexes using the createIndexes method
// MyModel.createIndexes()
//   .then(() => {
//     console.log("Indexes created successfully");
//   })
//   .catch((err) => {
//     console.error("Error creating indexes:", err);
//   });
