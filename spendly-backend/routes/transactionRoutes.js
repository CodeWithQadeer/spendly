const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addExpense,
  getAll,
  clearAllTransactions,
  resetAll,
  getHistory,
  updateTransaction,
  deleteTransaction,
  applyRecurring,
} = require("../controllers/transactionController");

router.post("/add", auth, addExpense);
router.get("/", auth, getAll);
router.get("/history", auth, getHistory);
router.post("/recurring/apply", auth, applyRecurring);
router.delete("/clear", auth, clearAllTransactions);
router.delete("/reset", auth, resetAll);
router.patch("/:id", auth, updateTransaction);
router.delete("/:id", auth, deleteTransaction);

module.exports = router;
