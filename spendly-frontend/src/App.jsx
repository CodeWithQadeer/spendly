import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import allRoutes from "./routes/allRoutes";
import Navbar from "./components/Navbar";
import GlobalAuthLoader from "./components/GlobalAuthLoader";
import MobileBottomNav from "./components/MobileBottomNav";
import { loadUserFromToken } from "./features/authSlice";
import { fetchBalance } from "./features/balanceSlice";
import { fetchTransactions } from "./features/transactionSlice";

function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "d":
          navigate("/");
          break;
        case "h":
          navigate("/transactions");
          break;
        case "c":
          navigate("/calculator");
          break;
        case "a":
          navigate("/add-expense");
          break;
        case "m":
          navigate("/add-money");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return null;
}

function AppInner() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  // On initial load, if we have a token, restore the user
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      dispatch(loadUserFromToken());
    }
  }, [dispatch]);

  // When user becomes available, preload core data
  useEffect(() => {
    if (user) {
      dispatch(fetchBalance());
      dispatch(fetchTransactions());
    }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <GlobalAuthLoader />
      <GlobalShortcuts />
      <MobileBottomNav />
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          {allRoutes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
