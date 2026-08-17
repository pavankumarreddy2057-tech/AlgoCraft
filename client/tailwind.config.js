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
        dark: {
          bg: '#0f1117',
          surface: '#181b23',
          card: '#1e222d',
          border: '#2a2f3d',
          input: '#151720',
          hover: '#262b38'
        },
        brand: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        },
        diff: {
          green: 'rgba(34, 197, 94, 0.15)',
          red: 'rgba(239, 68, 68, 0.15)',
          greenText: '#4ade80',
          redText: '#f87171'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
