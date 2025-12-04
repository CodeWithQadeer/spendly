import { useState } from "react";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { PlusCircle, MinusCircle, RotateCcw } from "lucide-react";

export default function Calculator() {
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [history, setHistory] = useState([]);

  const add = () => {
    if (value === "") return;
    const amount = Number(value);
    setBalance((prev) => Number(prev || 0) + amount);
    setHistory((prev) => [
      {
        id: Date.now() + Math.random(),
        type: "add",
        amount,
        label: label.trim(),
      },
      ...prev,
    ]);
    setValue("");
    setLabel("");
  };

  const subtract = () => {
    if (value === "") return;
    const amount = Number(value);
    setBalance((prev) => Number(prev || 0) - amount);
    setHistory((prev) => [
      {
        id: Date.now() + Math.random(),
        type: "subtract",
        amount,
        label: label.trim(),
      },
      ...prev,
    ]);
    setValue("");
    setLabel("");
  };

  const clear = () => {
    setBalance("");
    setValue("");
    setLabel("");
    setHistory([]);
  };

  return (
    <div className="app-shell flex justify-center">
      <div className="w-full max-w-xl animate-fadeIn">
        <h2 className="text-3xl font-bold mb-6">Expense Calculator</h2>

        <Card className="w-full p-6">
          {/* Live Balance Display */}
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm">Current Total</p>
            <h3 className="text-4xl font-extrabold text-primary mt-1">
              ₹{Number(balance || 0).toFixed(2)}
            </h3>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <Input
              type="number"
              placeholder="Current Amount"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="text-lg py-3"
            />

          <Input
            type="number"
            placeholder="Enter Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-lg py-3"
          />

          <Input
            placeholder="What is this for? (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="text-lg py-3"
          />
        </div>

        {/* Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Add */}
            <Button
              onClick={add}
              className="flex items-center justify-center gap-2 py-3 text-lg shadow-md hover:shadow-lg transition"
            >
              <PlusCircle size={22} /> Add
            </Button>

            {/* Subtract */}
            <Button
              onClick={subtract}
              className="bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 py-3 text-lg shadow-md hover:shadow-lg transition text-white"
            >
              <MinusCircle size={22} /> Subtract
            </Button>

            {/* Clear */}
            <Button
              onClick={clear}
              className="bg-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2 py-3 text-lg text-white shadow-md hover:shadow-lg transition"
            >
              <RotateCcw size={22} /> Clear
            </Button>
          </div>

          {history.length > 0 && (
            <div className="mt-6 space-y-2 text-sm">
              <p className="font-semibold text-gray-600">Quick breakdown</p>
              {history.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                >
                  <span className="text-gray-700">
                    {h.type === "add" ? "Added" : "Spent"}
                    {h.label ? ` · ${h.label}` : ""}
                  </span>
                  <span
                    className={
                      h.type === "add" ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"
                    }
                  >
                    {h.type === "add" ? "+" : "-"}₹{Number(h.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
