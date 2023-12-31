const mongoose = require("mongoose"); // Erase if already required
const validator = require("validator");
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "Your username is not unique"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Your Email is already registered"],
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.tmgWGdzGFmIwg1iaqCbSvgHaHa?w=179&h=194&c=7&r=0&o=5&pid=1.7",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.registerStatics = async function (
  username,
  email,
  password,
  mobile
) {
  console.log(username, email, password, mobile);
  if (!username || !email || !password || !mobile) {
    throw Error("Please fill in all fields");
  }

  const isEmail = await this.findOne({ email });
  if (isEmail) {
    throw Error("You already have registered. Please login to continue");
  }
  const isUsername = await this.findOne({ username });
  if (isUsername) {
    throw Error("You must have unique Username");
  }
  const isMobile = await this.findOne({ mobile });
  if (isMobile) {
    throw Error("Your mobile number should be unique");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  // Check if the username contains only alphanumeric characters and underscores
  // if (!validator.isAlphanumeric(username, "en-US")) {
  //   throw new Error(
  //     "Username should contain only letters, numbers, or underscores"
  //   );
  // }

  // Check if the username is at least 3 characters long
  if (!validator.isLength(username, { min: 3 })) {
    throw new Error("Username should be at least 3 characters long");
  }

  // Check if the mobile number is a valid phone number
  // if (!validator.isMobilePhone(mobile, "en-US")) {
  //   throw new Error("Invalid mobile number");
  // }

  if (!validator.isStrongPassword(password)) {
    throw Error("Weak Password");
  }

  console.log("here");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    email,
    password: hash,
    mobile,
  });

  return user;
};

userSchema.statics.loginStatics = async function (email, password) {
  if (!email || !password) {
    throw new Error("Please enter all credentials");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("You haven't registered yet");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Password doesn't match");
  }

  return user;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
