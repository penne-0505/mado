import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        glass: "rgb(var(--color-glass) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          warm: "rgb(var(--color-accent-warm) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 18px 40px -22px rgb(var(--color-shadow) / 0.7)",
      },
      borderRadius: {
        panel: "1.25rem",
      },
      keyframes: {
        "rise-fade": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "rise-fade": "rise-fade 540ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Sora", "Avenir Next", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
