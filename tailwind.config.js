/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'laila': ['"Laila"', 'serif'],
        'merriweather': ['"Merriweather"', 'serif'],
      },
    },
  },
  plugins: [],
}

