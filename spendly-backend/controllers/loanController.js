const Loan = require("../models/Loan");
const User = require("../models/User");

exports.addLoan = async (req, res) => {
  const { personName, amount, note } = req.body;

  await Loan.create({
    userId: req.user.id,
    personName,
    amount,
    note
  });

  res.json({ message: "Entry saved" });
};

exports.getLoans = async (req, res) => {
  const loans = await Loan.find({ userId: req.user.id });
  res.json(loans);
};

exports.markReturned = async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ message: "Not found" });

  loan.status = "returned";
  await loan.save();

  const user = await User.findById(req.user.id);
  user.currentBalance += loan.amount;
  await user.save();

  res.json({ message: "Loan marked as returned", balance: user.currentBalance });
};
