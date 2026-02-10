/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
        button: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: {
            dark: '#1F3D2B',
            base: '#2F5E44',
            hover: '#4F7F63',
            soft: '#8FB89C',
          },
          secondary: {
            accent: '#C9A24D',
            soft: '#E6D3A3',
          },
        },
        ui: {
          bg: {
            warm: '#F6F3EE',
            surface: '#FFFFFF',
          },
          border: '#D8D2C8',
          disabled: '#CFCAC2',
          text: {
            primary: '#243128',
            secondary: '#6F7F73',
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.border-gradient': {
          border: '1px solid transparent',
          backgroundImage:
            'linear-gradient(var(--tw-border-bg, #fff), var(--tw-border-bg, #fff)), linear-gradient(135deg, #f3e7cc 0%, #d7b56a 45%, #b8923f 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        },
      });
    },
  ],
};
