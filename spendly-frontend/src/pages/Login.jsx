import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../features/authSlice";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: authError } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");

    dispatch(loginUser(form))
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => {
        setError(err || "Invalid email or password");
      });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 animate-fadeIn">
      <Card className="w-full max-w-md p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {/* Error Message */}
        {(error || authError) && (
          <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm text-center font-medium">
            {error || authError}
          </p>
        )}

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={submit}>

          {/* Email */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <Mail size={20} className="text-gray-500" />
            <Input
              placeholder="Email"
              className="border-none focus:ring-0 bg-transparent w-full"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <Lock size={20} className="text-gray-500" />
            <Input
              type="password"
              placeholder="Password"
              className="border-none focus:ring-0 bg-transparent w-full"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="py-3 text-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <p className="text-gray-500 text-sm">OR</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => {
              if (!res.credential) {
                setError("Google login failed");
                return;
              }
              dispatch(googleLogin(res.credential))
                .unwrap()
                .then(() => navigate("/"))
                .catch((err) => setError(err || "Google login failed"));
            }}
            onError={() => setError("Google login failed")}
          />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link className="text-primary font-semibold" to="/register">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
