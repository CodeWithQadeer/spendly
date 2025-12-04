import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLoan, getLoans, markReturned } from "../features/loanSlice";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { User, IndianRupee, StickyNote, CheckCircle, Clock } from "lucide-react";

export default function MoneyGiven() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.loan);

  const [form, setForm] = useState({
    personName: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    dispatch(getLoans());
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();

    if (!form.personName || !form.amount) return;

    dispatch(addLoan(form))
      .unwrap()
      .then(() => {
        setForm({ personName: "", amount: "", note: "" });
        dispatch(getLoans());
      });
  };

  return (
    <div className="app-shell animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-6">Money Given</h2>

        {/* Form Section */}
        <Card className="max-w-lg p-6 mb-8 mx-auto">

        <form onSubmit={submit} className="flex flex-col gap-5">

          {/* Person Name */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <User size={20} className="text-gray-500" />
            <Input
              placeholder="Person Name"
              value={form.personName}
              onChange={(e) =>
                setForm({ ...form, personName: e.target.value })
              }
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          {/* Amount */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <IndianRupee size={20} className="text-gray-500" />
            <Input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          {/* Note */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <StickyNote size={20} className="text-gray-500" />
            <Input
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
              className="bg-transparent border-none focus:ring-0 w-full"
            />
          </div>

          <Button className="py-3 text-lg font-semibold" type="submit">
            Add Entry
          </Button>
        </form>
        </Card>

        {/* Loan Entries */}
        <div className="grid gap-5 max-w-2xl mx-auto">

        {list.length === 0 && (
          <p className="text-gray-500 text-center">No entries yet.</p>
        )}

        {list.map((l) => (
          <Card
            key={l._id}
            className="flex justify-between items-center p-5 hover:shadow-lg transition animate-fadeIn"
          >
            {/* Left Section */}
            <div>
              <p className="font-bold text-lg">{l.personName}</p>

              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <IndianRupee size={16} /> {Number(l.amount || 0).toFixed(2)}
              </p>

              {/* Status Badge */}
              <p
                className={`text-sm mt-2 flex items-center gap-1 font-medium px-3 py-1 rounded-full w-fit ${
                  l.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {l.status === "pending" ? (
                  <>
                    <Clock size={14} /> Pending
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} /> Returned
                  </>
                )}
              </p>

              {l.note && (
                <p className="text-gray-400 text-sm mt-2 italic">
                  “{l.note}”
                </p>
              )}
            </div>

            {/* Mark Returned Button */}
            {l.status === "pending" && (
              <Button
                onClick={() =>
                  dispatch(markReturned(l._id)).then(() =>
                    dispatch(getLoans())
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white ml-4 whitespace-nowrap"
              >
                Mark Returned
              </Button>
            )}
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
