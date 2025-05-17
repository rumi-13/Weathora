/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'rain': 'rain 1s linear forwards',
        'snow': 'snow 5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(calc(100vh + 20px))' },
        },
        snow: {
          '0%': { transform: 'translateY(-10px) translateX(0)' },
          '25%': { transform: 'translateY(25vh) translateX(10px)' },
          '50%': { transform: 'translateY(50vh) translateX(-10px)' },
          '75%': { transform: 'translateY(75vh) translateX(10px)' },
          '100%': { transform: 'translateY(calc(100vh + 10px)) translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(10px)' },
          '50%': { transform: 'translateY(0) translateX(20px)' },
          '75%': { transform: 'translateY(10px) translateX(10px)' },
        },
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}

