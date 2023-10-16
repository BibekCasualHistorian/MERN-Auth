const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

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
        secure: false,
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
      .cookie("token", token, { httpOnly: true, secure: false })
      .status(200)
      .json(rest);
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
};

const googleAuth = async (req, res) => {
  const { email, photo, name } = req.body;
  console.log("email", email, "photo", photo, "name", name);
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = await createJsonWebToken(user._id);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 360000); //adding 1 hour
      res
        .cookie("token", token, {
          httpOnly: true,
          expires: expiryDate,
          secure: false,
        })
        .status(200)
        .json(rest);
    } else {
      const randomPassword = await generateRandomPassword(16);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(randomPassword, salt);
      const uniqueUsername =
        name.split(" ").join("").toLowerCase() +
        Math.floor(Math.random() * 10000).toString();
      const userCreated = await userModel.create({
        username: uniqueUsername,
        password: hash,
        photo,
        mobile: Math.floor(Math.random() * 1000000),
        email,
      });
      console.log("userCreated", userCreated);
      const token = await createJsonWebToken(userCreated._id);
      const { password: hashedPassword, ...rest } = userCreated._doc;
      return res
        .cookie("token", token, { httpOnly: true, secure: false })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log("req.body", req.body);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user exist" });
  }
  if (req.user._id !== id) {
    return res.status(400).json({
      error: "You are only allowed to update your Account Details, not Others",
    });
  }

  try {
    const { password, ...res } = req;
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    console.log("updatedUser", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const signOut = async (req, res) => {
  console.log("signout");
  return res.clearCookie("token").status(200).json({ status: "Signed Out" });
};

const deleteUser = async (req, res) => {
  console.log("delete");
  const { id } = req.params;

  console.log("req.user", req.user._id, "in params", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  if (req.user._id !== id) {
    console.log("other id dodged");
    return res.status(400).json({ error: "You can't delete other's id" });
  }

  try {
    const deletedUser = await userModel.findOneAndDelete(
      {
        _id: id,
      },
      { new: true }
    );
    return res.status(200).json({ status: "The User is deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  updateUser,
  signOut,
  deleteUser,
};
