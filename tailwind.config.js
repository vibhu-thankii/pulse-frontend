/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4F46E5', // indigo-600
        'primary-light': '#EEF2FF', // indigo-50
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
