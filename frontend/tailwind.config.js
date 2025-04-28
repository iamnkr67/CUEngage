/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        slideInScale: {
          "0%": { transform: "translateY(100%) scale(0.8)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        typing: "typing 4s steps(30, end), blink 0.75s step-end infinite",
        "fade-in": "fadeIn 2s ease-in-out",
      },
    },
  },
  plugins: [],
};
