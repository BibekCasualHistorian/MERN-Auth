const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token in require Auth", token);
  if (!token) {
    return res.status(401).json({ error: "Sorry, Unauthorized Request" });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token verification failed" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  requireAuth,
};
