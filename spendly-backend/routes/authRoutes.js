const express = require("express");
const router = express.Router();

const { register, login, googleLogin, getMe } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// USER AUTH ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

// PROTECTED ROUTE
router.get("/me", auth, getMe);

module.exports = router;
