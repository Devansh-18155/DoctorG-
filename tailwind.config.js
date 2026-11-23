/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#172B4D',
          teal: '#087E8B',
          'teal-dark': '#06626D',
          'teal-light': '#EAF7F6',
          bg: '#F6F8FA',
          text: '#202A36',
          muted: '#718096',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(23, 43, 77, 0.05)',
        sheet: '0 -4px 20px rgba(23, 43, 77, 0.12)',
        float: '0 8px 30px rgba(8, 126, 139, 0.25)',
      }
    },
  },
  plugins: [],
}
