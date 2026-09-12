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
        willow: {
          900: '#070c0a',
          850: '#0c1410',
          800: '#111e18',
          700: '#172b22',
          600: '#1e3d30',
          emerald: '#10b981',
          gold: '#f59e0b',
          amber: '#fbbf24',
          neon: '#00ff87',
          card: 'rgba(18, 30, 24, 0.75)',
          border: 'rgba(16, 185, 129, 0.2)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-neon': '0 0 30px -4px rgba(0, 255, 135, 0.5)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
