const colors = {
  primary: "#005BBB", // Corporate Blue
  secondary: "#FFD500", // Corporate Yellow
  dark: "#1A1A1A",
  light: "#F8F9FA",
};

const daisyui = require("daisyui");
const daisyuiPlugin = daisyui.default ?? daisyui;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [daisyuiPlugin],
  daisyui: {
    themes: [
      {
        "fyp-theme": {
          primary: colors.primary,
          "primary-focus": "#00428a",
          "primary-content": "#ffffff",
          secondary: colors.secondary,
          "secondary-focus": "#e6b000",
          "secondary-content": "#1a1a1a",
          accent: "#0c4a6e",
          "accent-focus": "#08334d",
          neutral: "#2a2f3b",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": colors.light,
          "base-300": "#d1d5db",
          info: "#0ea5e9",
          success: "#16a34a",
          warning: "#f97316",
          error: "#dc2626",
        },
      },
      "light",
      "dark",
    ],
    base: true,
    styled: true,
  },
};
