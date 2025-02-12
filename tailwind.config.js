/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pse-green": "#2dc275",
        "pse-footer": "#393f4e",
        "pse-black": "#27272a",
      },
      fontFamily: {
        "inter": "inter"
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(45, 194, 117, 0.6), 0 0 20px rgba(45, 194, 117, 0.8)',
      },
    },
  },
  plugins: [],
}
