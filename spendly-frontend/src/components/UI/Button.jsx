export default function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props
}) {
  const base =
    "btn px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-white hover:brightness-110",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-400 text-gray-700 bg-white hover:bg-gray-100",
    ghost:
      "text-gray-700 hover:bg-gray-100 shadow-none bg-transparent",
  };

  const spinner = (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
  );

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? spinner : children}
    </button>
  );
}
