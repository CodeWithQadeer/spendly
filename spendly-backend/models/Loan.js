const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    personName: String,
    amount: Number,
    note: String,
    status: { type: String, enum: ["pending", "returned"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
