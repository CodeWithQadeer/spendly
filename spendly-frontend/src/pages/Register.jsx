import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    dispatch(registerUser(form))
      .unwrap()
      .then(() => navigate("/login"))
      .catch((msg) => setError(msg || "Registration failed. Please try again."));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 animate-fadeIn">
      <Card className="w-full max-w-md p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={submit}>

          {/* Name Field */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <User size={20} className="text-gray-500" />
            <Input
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <Mail size={20} className="text-gray-500" />
            <Input
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <Lock size={20} className="text-gray-500" />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="py-3 text-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            Register
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link className="text-primary font-semibold" to="/login">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
