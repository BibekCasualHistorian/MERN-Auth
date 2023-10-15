const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createJsonWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

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
    const { password: hashedPassword, ...rest } = user._doc;
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
};

const googleAuth = async (req, res) => {
  const { email, photo, name } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = await createJsonWebToken(user._id);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 360000); //adding 1 hour
      res
        .cookie("token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const randomPassword = await generateRandomPassword(16);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(salt, randomPassword);
      const uniqueUsername =
        name.split(" ").join("").toLowerCase() +
        Math.floor(Math.random() * 10000).toString();
      const userCreated = await userModel.create({
        username: uniqueUsername,
        password: hash,
        photo,
        mobile: 1000,
        email,
      });
      console.log("userCreated", userCreated);
      const token = await createJsonWebToken(userCreated._id);
      res.cookie("token", token, { httpOnly: true });
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
};
