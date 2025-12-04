// src/pages/Transactions.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  clearAllTransactions,
  fetchHistory,
  resetAll,
} from "../features/transactionSlice";
import Card from "../components/UI/Card";

import { fetchBalance } from "../features/balanceSlice";

import { saveAs } from "file-saver";

import { deleteTransaction, updateTransaction, applyRecurring } from "../features/transactionSlice";

import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  MoreHorizontal,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  History,
  AlertTriangle,
  DollarSign,
  RotateCcw,
} from "lucide-react";

export default function Transactions() {
  const dispatch = useDispatch();
  const { list, history } = useSelector((s) => s.transactions);
  // re-fetch when balance changes so income transactions show immediately
  const balance = useSelector((s) => s.balance.currentBalance);

  const [showHistory, setShowHistory] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const [editingTx, setEditingTx] = useState(null);

  // load transactions on mount and whenever balance changes
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch, balance]);

  const categoryIcons = {
    Food: <Utensils size={22} className="text-orange-500" />,
    Travel: <Car size={22} className="text-blue-500" />,
    Shopping: <ShoppingBag size={22} className="text-pink-500" />,
    Home: <Home size={22} className="text-green-500" />,
    "Added Money": <DollarSign size={22} className="text-emerald-600" />,
    Other: <MoreHorizontal size={22} className="text-gray-500" />,
  };

  const getIcon = (cat) => categoryIcons[cat] || categoryIcons["Other"];

  // summary
  const { totalAdded, totalSpent } = useMemo(() => {
    let added = 0;
    let spent = 0;
    list.forEach((t) => {
      if (t.type === "income") added += Number(t.amount || 0);
      else spent += Number(t.amount || 0);
    });
    return { totalAdded: added, totalSpent: spent };
  }, [list]);

  const net = totalAdded - totalSpent;

  const filteredList = useMemo(() => {
    const now = new Date();
    const withinRange = (d) => {
      if (filterDate === "all") return true;
      const date = new Date(d);
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);
      if (filterDate === "7") return diffDays <= 7;
      if (filterDate === "30") return diffDays <= 30;
      return true;
    };

    return list.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && (t.category || "Other") !== filterCategory) return false;
      if (!withinRange(t.createdAt)) return false;
      return true;
    });
  }, [list, filterType, filterCategory, filterDate]);

  const exportCsv = () => {
    if (!list.length) return;
    const header = ["Date", "Type", "Category", "Amount", "Note"];
    const rows = list.map((t) => [
      new Date(t.createdAt).toLocaleString(),
      t.type,
      t.category || "",
      t.amount,
      (t.note || "").replace(/\n/g, " "),
    ]);
    const csvContent = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "spendly-transactions.csv");
  };

  const exportJson = () => {
    const data = { transactions: list, history };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    saveAs(blob, "spendly-data.json");
  };

  const confirmClear = () => {
    dispatch(clearAllTransactions()).then(() => {
      dispatch(fetchHistory());
      setShowWarning(false);
    });
  };

  const confirmReset = () => {
    dispatch(resetAll()).then(() => {
      dispatch(fetchBalance());
      setShowResetWarning(false);
    });
  };

  return (
    <div className="app-shell animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Transactions</h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setShowHistory((v) => !v);
              dispatch(fetchHistory());
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            <History size={18} /> History
          </button>

          {list.length > 0 && (
            <>
              <button
                onClick={() => setShowWarning(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
              >
                <Trash2 size={18} /> Clear All
              </button>

              <button
                onClick={() => setShowResetWarning(true)}
                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl shadow hover:bg-amber-600 transition"
              >
                <RotateCcw size={18} /> Reset All
              </button>
            </>
          )}
        </div>
      </div>

        {/* Filters */}
        <div className="mb-6 grid gap-3 md:grid-cols-3 text-sm">
          <div>
            <label className="block text-gray-600 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="all">All</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Home">Home</option>
              <option value="Other">Other</option>
              <option value="Added Money">Added Money</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Date</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="all">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
        </div>

        {/* Warning Modal - Clear All */}
        {showWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <Card className="p-6 max-w-sm text-center">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-4">
              This will clear all visible transactions. They will be moved to history.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </Card>
        </div>
      )}

        {/* Warning Modal - Reset All */}
        {showResetWarning && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <Card className="p-6 max-w-sm text-center">
              <AlertTriangle size={40} className="text-amber-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Reset everything?</h3>
              <p className="text-gray-600 mb-4">
                This will move all your transactions to history and set your balance
                back to ₹0. This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowResetWarning(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Reset All
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Summary */}
        {filteredList.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 border-l-4 border-emerald-500">
            <p className="text-sm text-gray-500">Total Added</p>
            <h3 className="text-2xl font-bold text-emerald-600">
              ₹{Number(totalAdded || 0).toFixed(2)}
            </h3>
          </Card>

          <Card className="p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Total Spent</p>
            <h3 className="text-2xl font-bold text-red-600">
              ₹{Number(totalSpent || 0).toFixed(2)}
            </h3>
          </Card>

          <Card className="p-6 border-l-4 border-sky-500">
            <p className="text-sm text-gray-500">Net Difference</p>
            <h3
              className={`text-2xl font-bold ${
                net >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              ₹{Number(net || 0).toFixed(2)}
            </h3>
          </Card>
        </div>
      )}

        {/* History Dropdown */}
        {showHistory && (
          <div className="mb-10 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History size={20} className="text-indigo-600" />
            Deleted Transactions History
          </h3>

          {history.length === 0 ? (
            <p className="text-gray-500">No history available.</p>
          ) : (
            history.map((h) => (
              <Card key={h._id} className="p-4 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">
                      {h.category || "Other"} —
                      <span className="text-gray-600">
                        ₹{Number(h.amount || 0).toFixed(2)}
                      </span>
                    </p>
                    {h.note && <p className="text-gray-600 text-sm mt-1">{h.note}</p>}
                    <p className="text-gray-400 text-xs mt-2">Deleted: {new Date(h.deletedAt).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

        {/* Transaction List */}
      <div className="grid gap-5 max-w-2xl mx-auto">
        {filteredList.length === 0 && <p className="text-gray-500">No transactions yet.</p>}

        {filteredList.map((t) => {
          const isExpense = t.type === "expense";
          const amountClass = isExpense ? "text-red-600" : "text-emerald-600";
          const sign = isExpense ? "-" : "+";
          return (
            <Card key={t._id} className="flex justify-between items-center p-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full">{getIcon(t.category)}</div>

                <div>
                  <p className="font-bold">{t.category || (t.type === "income" ? "Added Money" : "Other")}</p>
                  {t.note && <p className="text-gray-500">{t.note}</p>}
                  <p className="text-gray-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 font-bold text-lg">
                  {isExpense ? (
                    <ArrowDownCircle size={20} className="text-red-600" />
                  ) : (
                    <ArrowUpCircle size={20} className="text-emerald-600" />
                  )}
                  <span className={amountClass}>
                    {sign}₹{Number(t.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => setEditingTx(t)}
                    className="hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteTransaction(t._id))}
                    className="hover:text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateTransaction({
                          id: t._id,
                          updates: { isRecurring: !t.isRecurring },
                        })
                      )
                    }
                    className={t.isRecurring ? "text-emerald-600" : "hover:text-gray-700"}
                  >
                    {t.isRecurring ? "Recurring" : "Make Recurring"}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
        </div>
      </div>

      {/* Edit transaction modal */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit transaction</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const category = formData.get("category");
                const note = formData.get("note");
                dispatch(
                  updateTransaction({
                    id: editingTx._id,
                    updates: {
                      category,
                      note,
                    },
                  })
                ).then(() => setEditingTx(null));
              }}
            >
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <input
                  name="category"
                  defaultValue={editingTx.category || ""}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note</label>
                <textarea
                  name="note"
                  defaultValue={editingTx.note || ""}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-20"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2 text-sm">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
