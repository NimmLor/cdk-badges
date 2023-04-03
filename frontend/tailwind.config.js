/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.svelte', './index.html'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        content: '#c9d1d9',
        link: '#58a6ff',
        primary: '#0d1117',
      },
    },
  },
}
