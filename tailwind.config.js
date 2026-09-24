/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#081C15',
          800: '#0D2B1D',
          700: '#1B4332',
          600: '#2D6A4F',
          500: '#40916C',
          400: '#52B788',
          300: '#74C69D',
        },
        accent: {
          green: '#20E070',
          gold: '#E5A93B',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
