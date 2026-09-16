/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        mill: {
          50: '#f3f6f4',
          100: '#e4ebe6',
          200: '#c5d4c9',
          800: '#1c3a32',
          900: '#12261f',
          950: '#0b1814',
        },
        kiln: {
          400: '#e8a54b',
          500: '#d48a22',
        },
      },
      boxShadow: {
        panel: '0 18px 40px -24px rgba(11, 24, 20, 0.55)',
      },
    },
  },
  plugins: [],
};
