import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMoney } from "../features/balanceSlice";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

export default function AddMoney() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError("");
    setLoading(true);

    dispatch(addMoney({ amount: Number(amount) }))
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => setError("Failed to add money. Please try again."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-center px-4 mt-10">
      <Card className="w-full max-w-xl p-6 animate-fadeIn">
        
        {/* Header */}
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Wallet size={28} className="text-primary" />
          Add Money
        </h2>

        {/* Error message */}
        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-3 text-sm font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={submit}>

          {/* Amount Input */}
          <Input
            type="number"
            placeholder="Enter amount to add"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg py-3"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Money"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
