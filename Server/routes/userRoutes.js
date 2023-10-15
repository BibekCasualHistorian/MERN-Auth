const {
  register,
  login,
  googleAuth,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google-auth", googleAuth);

module.exports = router;
