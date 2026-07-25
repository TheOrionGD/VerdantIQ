/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-mint': {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        'forest-teal': {
          DEFAULT: '#0F766E',
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        'sage-white': '#F3F7F5',
        'deep-charcoal': '#0F172A',
        'slate-gray': '#475569',
        'amber-sun': '#D97706',
        'crimson-red': '#DC2626',
        'lime-forest': '#4D7C0F',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 118, 110, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(5, 150, 105, 0.15)',
        'node-glow': '0 0 25px -5px rgba(5, 150, 105, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash-flow': 'dash 20s linear infinite',
        'float-gentle': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        dash: {
          to: { 'stroke-dashoffset': '-100' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
