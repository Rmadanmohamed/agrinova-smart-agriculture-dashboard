/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 34px rgba(34, 211, 238, 0.18)',
        soft: '0 22px 70px rgba(0, 0, 0, 0.32)',
      },
    },
  },
  plugins: [],
};
