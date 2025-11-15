export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6fff7",
          100: "#ccfff0",
          200: "#99ffe1",
          300: "#66ffd2",
          400: "#33ffc3",
          500: "#00cc99",
          600: "#00a37a",
          700: "#007a5c",
          800: "#00523d",
          900: "#00291f",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
