/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-active': '#e0f2f7',
        'text-dark': '#1f2937',
        'text-light': '#6b7280',
        'accent-green': '#10b981',
        'drawdown-pink': '#fca5a5',
        'bg-light': '#f9fafb',
      },
    },
  },
  plugins: [],
}
