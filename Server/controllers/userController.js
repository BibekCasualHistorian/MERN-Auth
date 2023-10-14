const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createJsonWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const register = async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    // One way
    // const user = new userModel({ username, email, password, mobile });
    // await user.save();

    // Another way to create a collection
    const user = await userModel.registerStatics(
      username,
      email,
      password,
      mobile
    );
    const token = createJsonWebToken(user._id);

    // We don't want to send the password to user so
    const { password: hashedPassword, ...rest } = user._doc;

    // adding expiry date for token, we need to sign in every time we request for anything
    // api, so we use expires feautres to use that same token for certain time
    const expirayDate = new Date(Date.now() + 360000); // for 1 hour
    // return res.status(200).json(user);
    res
      .cookie("token", token, {
        // httpOnly: true, // client won't be accesss the sent cookie
        // when does it expires, it denotes that, alternate property is maxAge
        expires:
          expirayDate /* there are other too like signed, secure, overwrite etc*/,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ status: "error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.loginStatics(email, password);
    const token = createJsonWebToken(user._id);
    const { password: hashedPassword, ...rest } = user;
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
