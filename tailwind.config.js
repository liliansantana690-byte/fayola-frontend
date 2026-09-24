/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: { DEFAULT: '#ff6a3d', dark: '#e2521f' },
        violet: { DEFAULT: '#a855f7' },
        mint: { DEFAULT: '#34d399' },
        rose: { DEFAULT: '#f43f5e' },
        paper: '#f5f0e6',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};