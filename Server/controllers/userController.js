const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    // One way
    // const user = new userModel({ username, email, password, mobile });
    // await user.save();

    // Another way tto
    const user = await userModel.registerStatics(
      username,
      email,
      password,
      mobile
    );
    res.status(200).json(user);
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ status: "error", error });
  }
};

const login = async (req, res) => {
  try {
    const user = await userModel.loginStatics(email, password);
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
