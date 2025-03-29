/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        'primary-dark': '#2E7D32',
        accent: '#FFC107',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        error: '#D32F2F',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Poppins', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class', // for dark mode implementation
}