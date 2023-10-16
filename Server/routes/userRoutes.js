const {
  register,
  login,
  googleAuth,
  updateUser,
  signOut,
  deleteUser,
} = require("../controllers/userController");
const { requireAuth } = require("../utils/requireAuth");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google-auth", googleAuth);

router.patch("/update/:id", requireAuth, updateUser);

router.get("/signout", signOut);

router.delete("/delete/:id", requireAuth, deleteUser);

module.exports = router;
