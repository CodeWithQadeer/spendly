import { useSelector } from "react-redux";

export default function GlobalAuthLoader() {
  const loading = useSelector((s) => s.auth.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 bg-white/90 px-6 py-4 rounded-2xl shadow-lg">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-700 font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
