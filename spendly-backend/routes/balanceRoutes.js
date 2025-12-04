const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { setInitialBalance, addMoney } = require("../controllers/balanceController");

router.post("/initial", auth, setInitialBalance);
router.post("/add", auth, addMoney);

module.exports = router;
