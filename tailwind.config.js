/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0B",
        surface: "#121816",
        panel: "#0f1a18",
        border: "rgba(45, 212, 191, 0.12)",
        "border-strong": "rgba(45, 212, 191, 0.22)",
        primary: "#f5f5f5",
        muted: "#8a9a96",
        accent: "#2dd4bf",
        "accent-dim": "#14b8a6",
        teal: {
          glow: "#2dd4bf",
          dark: "#0d3d38",
        },
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        bubble: "18px",
        input: "14px",
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(45, 212, 191, 0.08)",
        panel: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "panel-gradient":
          "linear-gradient(145deg, rgba(13, 61, 56, 0.55) 0%, rgba(11, 11, 11, 0.85) 100%)",
        "chat-gradient":
          "radial-gradient(ellipse at 50% 0%, rgba(20, 80, 72, 0.35) 0%, rgba(11, 11, 11, 0) 60%)",
        "bubble-assistant":
          "linear-gradient(135deg, rgba(20, 70, 64, 0.7) 0%, rgba(15, 45, 42, 0.85) 100%)",
        "bubble-user":
          "linear-gradient(135deg, rgba(45, 212, 191, 0.25) 0%, rgba(20, 184, 166, 0.15) 100%)",
      },
    },
  },
  plugins: [],
};
