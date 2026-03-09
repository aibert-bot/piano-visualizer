/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'piano-bg': '#1a1a2e',
        'piano-blue': '#3b82f6',
        'piano-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
