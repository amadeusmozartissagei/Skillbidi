/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins']
      },
    },
    screens: {
      'ph': '320px',
      //=> phone
      'ml': '425px',
      //=> mobile large
      ...defaultTheme.screens,
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}