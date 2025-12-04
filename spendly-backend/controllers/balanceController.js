const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Set initial balance
exports.setInitialBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.initialBalance = Number(amount);
    user.currentBalance = Number(amount);
    await user.save();

    return res.json({ balance: user.currentBalance });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add money & create income transaction (returns transaction)
exports.addMoney = async (req, res) => {
  try {
    const { amount, category = "Added Money", note = "Balance top-up" } = req.body;
    const userId = req.user.id;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.currentBalance += Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId,
      type: "income",
      amount: Number(amount),
      category,
      note,
      balanceAfter: user.currentBalance,
    });

    return res.json({ transaction, balance: user.currentBalance });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
