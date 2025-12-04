import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import allRoutes from "./routes/allRoutes";
import Navbar from "./components/Navbar";

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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <GlobalShortcuts />
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          {allRoutes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
