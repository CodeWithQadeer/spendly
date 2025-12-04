export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        primarySoft: "#6366f1",
        accent: "#22c55e",
        accentSoft: "#a5b4fc",
        lightBg: "#f8f9ff",
      },
      boxShadow: {
        card: "0 18px 45px rgba(15,23,42,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
