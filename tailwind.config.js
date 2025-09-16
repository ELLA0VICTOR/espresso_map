/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        coffee: {
          50: '#f9f7f4',
          100: '#f0ebe2',
          200: '#e7dbc7',
          300: '#dcc4a2',
          400: '#d1a97b',
          500: '#c8955f',
          600: '#bb8553',
          700: '#9b6f47',
          800: '#7e5a3e',
          900: '#664a33',
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '80%, 100%': {
            transform: 'scale(2.2)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'animate-pulse-ring',
    'animate-fade-in',
    'animate-slide-up',
    'bg-espresso-500',
    'bg-coffee-500',
    'text-espresso-700',
    'text-coffee-700',
    'border-espresso-300',
    'border-coffee-300',
  ]
}