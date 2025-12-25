import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, PlusCircle, Calculator, Users } from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 border-t border-gray-200 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto flex justify-between px-4 py-2 text-xs text-gray-600">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 flex-1 ${
            isActive("/") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          to="/transactions"
          className={`flex flex-col items-center gap-0.5 flex-1 ${
            isActive("/transactions") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Wallet size={20} />
          <span>History</span>
        </Link>

        <Link
          to="/add-expense"
          className="flex flex-col items-center -mt-5 flex-1"
          aria-label="Quick add expense"
        >
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-white flex items-center justify-center shadow-lg">
            <PlusCircle size={22} />
          </div>
          <span className="mt-0.5 text-gray-700 text-[11px] font-semibold">Add</span>
        </Link>

        <Link
          to="/calculator"
          className={`flex flex-col items-center gap-0.5 flex-1 ${
            isActive("/calculator") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Calculator size={20} />
          <span>Calc</span>
        </Link>

        <Link
          to="/money-given"
          className={`flex flex-col items-center gap-0.5 flex-1 ${
            isActive("/money-given") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Users size={20} />
          <span>Loans</span>
        </Link>
      </div>
    </nav>
  );
}