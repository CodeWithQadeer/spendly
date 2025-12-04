import { useEffect, useMemo, useState } from "react";
import Card from "../components/UI/Card";
import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  ArrowRightCircle,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Utensils,
  Car,
  ShoppingBag,
  Home as HomeIcon,
  MoreHorizontal,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../features/balanceSlice";
import { fetchTransactions } from "../features/transactionSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const balance = useSelector((s) => s.balance.currentBalance);
  const transactions = useSelector((s) => s.transactions.list || []);

  const [budgets, setBudgets] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("spendly-budgets") || "{}");
    } catch {
      return {};
    }
  });
  const [budgetsOpen, setBudgetsOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchBalance());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spendly-budgets", JSON.stringify(budgets));
    }
  }, [budgets]);

  const categoryIcons = {
    Food: <Utensils size={20} className="text-orange-500" />,
    Travel: <Car size={20} className="text-blue-500" />,
    Shopping: <ShoppingBag size={20} className="text-pink-500" />,
    Home: <HomeIcon size={20} className="text-green-500" />,
    "Added Money": <DollarSign size={20} className="text-emerald-600" />,
    Other: <MoreHorizontal size={20} className="text-gray-500" />,
  };

  const getIcon = (cat) => categoryIcons[cat] || categoryIcons["Other"];

  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const key = t.category || "Other";
      totals[key] = (totals[key] || 0) + Number(t.amount || 0);
    });
    return totals;
  }, [transactions]);

  return (
    <div className="app-shell animate-fadeIn">

      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-6 tracking-tight">
        Dashboard
      </h1>

      {/* Balance Card (Cyber Neon Gradient) */}
      <div className="mb-8">
        <div className="bg-linear-to-r from-sky-500 to-indigo-500 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">

          {/* Neon glow circles */}
          <div className="absolute top-0 right-0 h-28 w-28 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>

          <p className="text-sm opacity-90">Current Balance</p>
          <h2 className="text-5xl font-bold mt-2 tracking-tight">
            ₹{Number(balance || 0).toFixed(2)}
          </h2>

          <div className="mt-4 flex items-center gap-2 opacity-80 text-sm">
            <Wallet size={18} /> Updated just now
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">

        {/* Add Money */}
        <Link to="/add-money">
          <Card hover glass className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 rounded-full bg-sky-100 text-sky-500 shadow-sm">
              <Plus size={30} />
            </div>
            <p className="text-lg font-semibold">Add Money</p>
          </Card>
        </Link>

        {/* Add Expense */}
        <Link to="/add-expense">
          <Card hover glass className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 rounded-full bg-red-100 text-red-500 shadow-sm">
              <Minus size={30} />
            </div>
            <p className="text-lg font-semibold text-red-500">Add Expense</p>
          </Card>
        </Link>

        {/* Calculator */}
        <Link to="/calculator" className="hidden sm:block">
          <Card hover glass className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
              <ArrowRightCircle size={30} />
            </div>
            <p className="text-lg font-semibold">Calculator</p>
          </Card>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 gap-6">

        {/* Transactions */}
        <Card
          hover
          className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl border-gray-200"
        >
          <div>
            <h3 className="text-xl font-bold">All Transactions</h3>
            <p className="text-gray-500 text-sm mt-1">
              See complete history
            </p>
          </div>
          <Link
            to="/transactions"
            className="text-sky-600 font-semibold flex items-center gap-1"
          >
            View <ArrowRightCircle size={20} />
          </Link>
        </Card>

        {/* Money Given */}
        <Card
          hover
          className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl border-gray-200"
        >
          <div>
            <h3 className="text-xl font-bold">Money Given</h3>
            <p className="text-gray-500 text-sm mt-1">
              Track borrowed amounts
            </p>
          </div>
          <Link
            to="/money-given"
            className="text-sky-600 font-semibold flex items-center gap-1"
          >
            Open <ArrowRightCircle size={20} />
          </Link>
        </Card>
      </div>

      {/* Budgets & category insights */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/90">
          <button
            type="button"
            onClick={() => setBudgetsOpen((open) => !open)}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <div>
              <h3 className="text-xl font-bold">Category Budgets</h3>
              <p className="text-gray-500 text-sm">
                Set monthly limits and see how close you are for each category.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{budgetsOpen ? "Hide" : "Show"}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    budgetsOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </div>
          </button>

          {budgetsOpen && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {Object.entries({
                Food: "Food",
                Travel: "Travel",
                Shopping: "Shopping",
                Home: "Home",
                Other: "Other",
              }).map(([key, label]) => {
                const spent = categoryTotals[label] || 0;
                const budget = budgets[label] || 0;
                const percent = budget ? Math.min(100, (spent / budget) * 100) : 0;
                const over = budget && spent > budget;
                const remaining = budget ? Math.max(0, budget - spent) : 0;

                return (
                  <div
                    key={key}
                    className="space-y-2 rounded-xl border border-gray-100 bg-white/70 px-3 py-2 shadow-sm"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{label}</span>
                        {over && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                            Over budget
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <div>
                          Spent: ₹{spent.toFixed(2)}{" "}
                          {budget ? `/ ₹${budget.toFixed(2)}` : "(no limit)"}
                        </div>
                        {budget > 0 && !over && (
                          <div>Left: ₹{remaining.toFixed(2)}</div>
                        )}
                      </div>
                    </div>

                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          over ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <input
                        type="number"
                        min="0"
                        placeholder="Set monthly budget (₹)"
                        className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        value={budget || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBudgets((prev) => ({
                            ...prev,
                            [label]: v === "" ? 0 : Number(v),
                          }));
                        }}
                      />
                      {budget > 0 && (
                        <span className="whitespace-nowrap text-[11px] uppercase tracking-wide text-gray-400">
                          {percent.toFixed(0)}% used
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="bg-white/90">
          <h3 className="text-xl font-bold mb-3">Spending Highlights</h3>
          <p className="text-gray-500 text-sm mb-4">
            Quick snapshot of where your money goes.
          </p>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">Add some transactions to see insights.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      {getIcon(label)}
                      {label}
                    </span>
                    <span className="text-gray-700">₹{value.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Mobile Calculator */}
      <Link to="/calculator">
        <Card
          hover
          className="mt-6 sm:hidden flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl"
        >
          <div>
            <h3 className="text-xl font-bold">Expense Calculator</h3>
            <p className="text-gray-500 text-sm mt-1">Quick calculations</p>
          </div>
          <ArrowRightCircle size={22} className="text-sky-600" />
        </Card>
      </Link>

      {/* Recent Transactions on Dashboard */}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Recent Transactions</h3>
          <Link
            to="/transactions"
            className="text-sm font-semibold text-primary hover:text-indigo-700 flex items-center gap-1"
          >
            View all
            <ArrowRightCircle size={16} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No transactions yet. Start by adding money or an expense.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => {
              const isExpense = t.type === "expense";
              const sign = isExpense ? "-" : "+";
              const amountClass = isExpense
                ? "text-red-500"
                : "text-emerald-600";

              return (
                <Card
                  key={t._id}
                  hover
                  className="flex items-center justify-between p-4 bg-white/90 border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      {getIcon(
                        t.category || (t.type === "income" ? "Added Money" : "Other")
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {t.category || (t.type === "income" ? "Added Money" : "Other")}
                      </p>
                      {t.note && (
                        <p className="text-gray-500 text-sm line-clamp-1">{t.note}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`font-semibold text-lg ${amountClass}`}>
                      {sign}₹{Number(t.amount || 0).toFixed(2)}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-gray-400 mt-1">
                      Balance: ₹{Number(t.balanceAfter ?? balance ?? 0).toFixed(2)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
