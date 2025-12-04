export default function Input({
  label,
  icon,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className={`
          flex items-center px-4 py-3 rounded-xl border 
          bg-gray-50 border-gray-300 
          focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30
          transition-all
          ${error ? "border-red-500 ring-red-300" : ""}
        `}
      >
        {/* Left Icon */}
        {icon && <span className="mr-3 text-gray-500">{icon}</span>}

        <input
          {...props}
          className={`bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full ${className}`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}
