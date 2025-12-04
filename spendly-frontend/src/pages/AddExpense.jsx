import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../features/transactionSlice";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Utensils,
  Car,
  ShoppingBag,
  Home,
  MoreHorizontal,
} from "lucide-react";

export default function AddExpense() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentBalance = useSelector((s) => s.balance.currentBalance ?? 0);

  const categories = [
    { label: "Food", icon: <Utensils size={20} /> },
    { label: "Travel", icon: <Car size={20} /> },
    { label: "Shopping", icon: <ShoppingBag size={20} /> },
    { label: "Home", icon: <Home size={20} /> },
    { label: "Other", icon: <MoreHorizontal size={20} /> },
  ];

  const [data, setData] = useState({
    amount: "",
    category: "",
    note: "",
  });

  const [customCategoryLabel, setCustomCategoryLabel] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    const numericAmount = Number(data.amount);

    if (!data.amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!data.category) {
      setError("Please select a category.");
      return;
    }

    const finalCategory =
      data.category === "Other" && customCategoryLabel
        ? customCategoryLabel
        : data.category;

    if (data.category === "Other" && !customCategoryLabel.trim()) {
      setError("Please enter a custom category name.");
      return;
    }

    if (numericAmount > Number(currentBalance || 0)) {
      setError("Expense amount is greater than your current balance.");
      return;
    }

    setError("");

    dispatch(
      addExpense({
        ...data,
        amount: numericAmount,
        category: finalCategory,
      })
    )
      .unwrap()
      .then(() => navigate("/"))
      .catch((msg) => {
        setError(msg || "Failed to add expense. Please try again.");
      });
  };

  return (
    <div className="flex justify-center px-4 mt-10">
      <Card className="w-full max-w-xl p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Wallet size={28} className="text-primary" />
          Add Expense
        </h2>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-3 text-sm font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={submit}>
          {/* Amount Input */}
          <Input
            type="number"
            placeholder="Expense Amount"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: e.target.value })}
          />

          {/* Category Selector */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Select Category</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((c) => {
                const isSelected = data.category === c.label;

                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      if (c.label === "Other") {
                        setData({
                          ...data,
                          category: "Other",
                        });
                      } else {
                        setCustomCategoryLabel("");
                        setData({
                          ...data,
                          category: c.label,
                        });
                      }
                    }}
                    className={`
                      w-full p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-white border-transparent shadow-lg scale-[1.03] ring-2 ring-indigo-300"
                          : "bg-white border-gray-300 hover:bg-gray-50 active:scale-[0.97] text-gray-700"
                      }
                    `}
> 
                    <div
                      className={`p-2 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.icon}
                    </div>

                    <span className="text-sm font-medium">
                      {c.label === "Other" && customCategoryLabel
                        ? customCategoryLabel
                        : c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom category name when "Other" is selected */}
          {data.category === "Other" && (
            <div>
              <p className="text-sm text-gray-600 mt-4 mb-2">
                Name this category
              </p>
              <Input
                placeholder="e.g. Snacks, Donation, Movie Night"
                value={customCategoryLabel}
                onChange={(e) => setCustomCategoryLabel(e.target.value)}
              />
            </div>
          )}

          {/* Note Input */}
          <Input
            placeholder="Note (optional)"
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
          />

          {/* Submit Button */}
          <Button type="submit" className="mt-2">
            Add Expense
          </Button>
        </form>
      </Card>
    </div>
  );
}
