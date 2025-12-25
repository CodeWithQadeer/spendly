import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { Menu, Home, Wallet, Calculator, LogOut, X, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const token = localStorage.getItem("auth-token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("spendly-theme") || "light";
  });

  // Apply theme to the document when it changes; this is the ONLY place
  // that controls dark mode, and it does not read system theme.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("spendly-theme", theme);
    }
  }, [theme]);

  if (!token) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="nav-shell bg-white/70 backdrop-blur-lg shadow-md px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Go to dashboard">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center shadow-card">
            <span className="text-white text-xl font-black">₹</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Spendly
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.18em]">
              Smart Expenses
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          <Link to="/" className="flex items-center gap-2 hover:text-primary transition">
            <Home size={20} /> Dashboard
          </Link>

          <Link to="/transactions" className="flex items-center gap-2 hover:text-primary transition">
            <Wallet size={20} /> History
          </Link>

          <Link to="/calculator" className="flex items-center gap-2 hover:text-primary transition">
            <Calculator size={20} /> Calculator
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
            aria-label="Log out"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-5 gap-6 text-gray-700 font-medium">

          <Link
            onClick={() => setOpen(false)}
            to="/"
            className="flex items-center gap-3 hover:text-primary transition"
          >
            <Home size={22} /> Dashboard
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/transactions"
            className="flex items-center gap-3 hover:text-primary transition"
          >
            <Wallet size={22} /> History
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/calculator"
            className="flex items-center gap-3 hover:text-primary transition"
          >
            <Calculator size={22} /> Calculator
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />} Theme
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={22} /> Logout
          </button>
        </div>
      </div>

      {/* Background overlay when mobile menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </nav>
  );
}
