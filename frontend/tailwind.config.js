/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#64748b",
        line: "#d8dee9",
        brand: "#2563eb",
        accent: "#0f766e"
      }
    }
  },
  plugins: []
};
