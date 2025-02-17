/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pse-green": "#ff8a00",
        "pse-green-second": "#ff9601",
        "pse-green-third": "#ff9601bf",
        "pse-black": "#1a1a1a",
        "pse-black-light": "#252525",
        "pse-gray": "#828282",
        "pse-header": "#111111",
        "pse-footer": "#060606",
        "pse-text": "#ffffff",
        "pse-error": "#ff0000"
      },
      fontFamily: {
        "inter": "inter"
      },
      boxShadow: {
        'neon-green': '0 0 10px #ff9601, 0 0 20px #ff9601bf',
        "box": "4.0px 8.0px 8.0px rgba(0,0,0,0.38)"
      },
    },
  },
  plugins: [],
}
