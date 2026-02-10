/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            dark: "#1F3D2B",
            base: "#2F5E44",
            hover: "#4F7F63",
            soft: "#8FB89C",
          },
          gold: {
            accent: "#C9A24D",
            soft: "#E6D3A3",
          },
        },
        ui: {
          bg: {
            warm: "#F6F3EE",
            surface: "#FFFFFF",
          },
          border: "#D8D2C8",
          disabled: "#CFCAC2",
          text: {
            primary: "#243128",
            secondary: "#6F7F73",
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".border-gradient": {
          border: "1px solid transparent",
          backgroundImage:
            "linear-gradient(var(--tw-border-bg, #fff), var(--tw-border-bg, #fff)), linear-gradient(var(--tw-gradient-stops))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        },
      });
    },
  ],
};
