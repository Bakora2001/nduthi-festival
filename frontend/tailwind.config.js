/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0B8E36',
          'green-dark': '#076B29',
          'green-light': '#E7F5EC',
          red: '#D61F26',
          'red-dark': '#A8181D',
          gold: '#F5C542',
          'gold-dark': '#D9A82B',
          ink: '#14231A',
        },
      },
      fontFamily: {
        display: ['Outfit', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(20, 35, 26, 0.06)',
        'card-lg': '0 12px 32px rgba(20, 35, 26, 0.10)',
      },
      backgroundImage: {
        'kenya-flag': 'linear-gradient(180deg, #000000 0%, #000000 25%, #D61F26 25%, #D61F26 50%, #0B8E36 50%, #0B8E36 75%, #FFFFFF 75%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
};
