/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],                 // Body text
        poppins: ["Libre Baskerville", "serif"],        // Headings
      },

      colors: {
        primary: "#0F766E",        // Academic teal
        primaryDark: "#115E59",    // Deep teal
        background: "#F8FAFA",     // Paper background
        surface: "#FFFFFF",        // Cards
        textPrimary: "#0F172A",    // Main text
        textSecondary: "#475569",  // Secondary text
        borderSoft: "#E2E8F0",     // Borders
      },
    },
  },
  plugins: [],
};
