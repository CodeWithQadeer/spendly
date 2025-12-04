const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addLoan, getLoans, markReturned } = require("../controllers/loanController");

router.post("/add", auth, addLoan);
router.get("/", auth, getLoans);
router.patch("/returned/:id", auth, markReturned);

module.exports = router;
