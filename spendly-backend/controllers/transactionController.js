const Transaction = require("../models/Transaction");
const DeletedTransaction = require("../models/DeletedTransaction");
const User = require("../models/User");

// Create / Add Expense (returns the created transaction)
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, note } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.currentBalance < Number(amount)) {
      return res.status(400).json({ message: "Not enough balance" });
    }

    user.currentBalance -= Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "expense",
      amount: Number(amount),
      category,
      note,
      balanceAfter: user.currentBalance,
    });

    return res.json({ transaction, balance: user.currentBalance });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all active transactions
exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(transactions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Helper: store to history collection
async function storeToHistory(transactions, userId) {
  if (!transactions || transactions.length === 0) return;
  const formatted = transactions.map((t) => ({
    userId,
    type: t.type,
    amount: t.amount,
    category: t.category,
    note: t.note,
    createdAtOriginal: t.createdAt,
  }));
  await DeletedTransaction.insertMany(formatted);
}

// Clear visible transactions (move to history)
exports.clearAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).lean();

    await storeToHistory(transactions, userId);
    await Transaction.deleteMany({ userId });

    return res.json({ message: "All transactions moved to history and cleared." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Reset everything: move transactions to history and reset balances
exports.resetAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).lean();

    await storeToHistory(transactions, userId);
    await Transaction.deleteMany({ userId });

    const user = await User.findById(userId);
    user.currentBalance = 0;
    user.initialBalance = 0;
    await user.save();

    return res.json({ message: "Everything reset! Transactions saved to history.", balance: 0 });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get deleted transactions history
exports.getHistory = async (req, res) => {
  try {
    const history = await DeletedTransaction.find({ userId: req.user.id })
      .sort({ deletedAt: -1 })
      .lean();
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update a single transaction (category, note, isRecurring)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, note, isRecurring } = req.body;

    const update = {};
    if (typeof category === "string") update.category = category;
    if (typeof note === "string") update.note = note;
    if (typeof isRecurring === "boolean") update.isRecurring = isRecurring;

    const tx = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: update },
      { new: true }
    ).lean();

    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(tx);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete a single transaction and adjust balance accordingly
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tx = await Transaction.findOne({ _id: id, userId });
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Reverse the effect of this transaction on balance
    if (tx.type === "expense") {
      user.currentBalance += Number(tx.amount || 0);
    } else if (tx.type === "income") {
      user.currentBalance -= Number(tx.amount || 0);
      if (user.currentBalance < 0) user.currentBalance = 0;
    }

    await user.save();

    // move to history
    await storeToHistory([tx], userId);

    await Transaction.deleteOne({ _id: id, userId });

    return res.json({ message: "Transaction deleted", balance: user.currentBalance });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Apply recurring transactions for this user (duplicate and update balances)
exports.applyRecurring = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recurring = await Transaction.find({ userId, isRecurring: true }).lean();
    if (!recurring.length) {
      return res.json({ message: "No recurring transactions to apply", transactions: [], balance: user.currentBalance });
    }

    const newTransactions = [];

    for (const t of recurring) {
      const amount = Number(t.amount || 0);
      if (t.type === "expense") {
        if (user.currentBalance < amount) {
          // skip this one if not enough balance
          continue;
        }
        user.currentBalance -= amount;
      } else if (t.type === "income") {
        user.currentBalance += amount;
      }

      const created = await Transaction.create({
        userId,
        type: t.type,
        amount,
        category: t.category,
        note: t.note,
        balanceAfter: user.currentBalance,
        isRecurring: t.isRecurring,
      });

      newTransactions.push(created.toObject());
    }

    await user.save();

    return res.json({
      message: "Recurring transactions applied",
      transactions: newTransactions,
      balance: user.currentBalance,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
