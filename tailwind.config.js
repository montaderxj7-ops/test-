/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C5A059',
          hover: '#b58d43',
        },
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#1a1a1a',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#b3b3b3',
        }
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'sans-serif'],
        english: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        neonPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(197,160,89,0.5))' },
          '50%': { filter: 'drop-shadow(0 0 35px rgba(197,160,89,1))' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'neon-pulse': 'neonPulse 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
