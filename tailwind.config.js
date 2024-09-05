/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
   
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

}