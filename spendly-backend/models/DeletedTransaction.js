const mongoose = require("mongoose");

const deletedTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // 'income' | 'expense'
    amount: { type: Number, required: true },
    category: { type: String },
    note: { type: String },
    createdAtOriginal: { type: Date },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

deletedTransactionSchema.index({ userId: 1, deletedAt: -1 });

module.exports = mongoose.model("DeletedTransaction", deletedTransactionSchema);
