/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e9f5f1",
          100: "#c9e6dc",
          200: "#a0d3c1",
          300: "#6fbaa0",
          400: "#3f9d80",
          500: "#1f8267",
          600: "#136a53",
          700: "#0f5744",
          800: "#0c4b3a",
          900: "#0a3d30",
          950: "#062a21",
        },
        canvas: "#f5f7f6",
        ink: "#111827",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 20, 0.06), 0 1px 3px rgba(16, 24, 20, 0.08)",
        nav: "0 -2px 10px rgba(16, 24, 20, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
