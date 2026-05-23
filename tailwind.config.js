/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5E6D8",
        surface: "#FAF0E8",
        cream: "#FFF8F2",
        charcoal: "#1A1A1A",
        border: "rgba(232, 93, 44, 0.2)",
        primary: "#2D1810",
        muted: "#8B6B5C",
        accent: "#E85D2C",
        "accent-hover": "#D14E22",
        "accent-soft": "#F4A574",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        card: "20px",
        bubble: "18px",
        input: "16px",
        pill: "999px",
      },
      boxShadow: {
        bubble: "0 4px 20px rgba(232, 93, 44, 0.12)",
        card: "0 8px 32px rgba(45, 24, 16, 0.08)",
      },
      animation: {
        "brain-float": "brainFloat 8s ease-in-out infinite",
        "brain-pulse": "brainPulse 3s ease-in-out infinite",
        "orbit": "orbit 24s linear infinite",
      },
      keyframes: {
        brainFloat: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-12px) scale(1.02)" },
        },
        brainPulse: {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "0.42" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
