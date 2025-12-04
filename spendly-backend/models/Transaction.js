const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["expense", "income"], required: true },
    amount: Number,
    category: String,
    note: String,
    balanceAfter: Number,
    // whether this transaction should repeat when applying recurring templates
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
