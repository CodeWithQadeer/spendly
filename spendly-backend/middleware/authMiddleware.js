const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  // Accept "Bearer <token>"
  if (token && token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  // Fallback: accept "auth-token"
  if (!token) token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Your JWT payload is { user: { id } }
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Token is invalid" });
  }
};
