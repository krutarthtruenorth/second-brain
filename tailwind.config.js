/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#1e1e1e",
        border: "#2a2a2a",
        primary: "#f5f5f5",
        muted: "#888888",
        accent: "#6366f1",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        bubble: "12px",
        input: "8px",
      },
    },
  },
  plugins: [],
};
