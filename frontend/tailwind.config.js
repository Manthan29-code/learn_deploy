/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0f172a",
        card: "#111827",
        accent: "#f97316",
        accentSoft: "#fdba74",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(251,146,60,0.35), 0 10px 40px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
