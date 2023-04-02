/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.svelte", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: '#0d1117',
        content: '#c9d1d9',
        link: '#58a6ff'
      },
    },
  },
  plugins: [],
}

