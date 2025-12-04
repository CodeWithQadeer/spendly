import { lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const AddExpense = lazy(() => import("../pages/AddExpense"));
const AddMoney = lazy(() => import("../pages/AddMoney"));
const Transactions = lazy(() => import("../pages/Transactions"));
const MoneyGiven = lazy(() => import("../pages/MoneyGiven"));
const Calculator = lazy(() => import("../pages/Calculator"));
const NotFound = lazy(() => import("../pages/NotFound"));

const allRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/add-expense",
    element: (
      <ProtectedRoute>
        <AddExpense />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-money",
    element: (
      <ProtectedRoute>
        <AddMoney />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/money-given",
    element: (
      <ProtectedRoute>
        <MoneyGiven />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calculator",
    element: (
      <ProtectedRoute>
        <Calculator />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
];

export default allRoutes;
