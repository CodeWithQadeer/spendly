export default function Card({
  children,
  className = "",
  hover = false,
  glass = false,
  padding = "p-5",
  ...props
}) {
  // Base card styles; theme is controlled via the global `body.dark` class in index.css
  const base =
    "card rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300";

  const glassMode =
    "card-glass backdrop-blur-md bg-white/60 border-white/30 shadow-sm";

  const hoverEffect = hover
    ? "hover:shadow-xl hover:-translate-y-1"
    : "";

  return (
    <div
      {...props}
      className={`
        ${base}
        ${glass ? glassMode : ""}
        ${padding}
        ${hoverEffect}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
