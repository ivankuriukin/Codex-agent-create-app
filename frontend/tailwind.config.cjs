/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
        button: ['Inter', 'PT Root UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          base: '#2F5E44',
          hover: '#4F7F63',
          active: '#1F3D2B',
        },
        secondary: {
          base: '#C9A24D',
          hover: '#E6D3A3',
          active: '#B08A3C',
        },
        surface: {
          base: '#FAF9F6',
          muted: '#F6F3EE',
          raised: '#ECE7DE',
          border: '#D8D2C8',
        },
        content: {
          primary: '#243128',
          secondary: '#6F7F73',
          disabled: '#9CA3AF',
          onPrimary: '#FFFFFF',
          onSecondary: '#243128',
        },
        state: {
          disabled: '#CFCAC2',
          danger: '#9B2C2C',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.border-gradient': {
          position: 'relative',
        },
        '.border-gradient::after': {
          content: '""',
          position: 'absolute',
          inset: '0',
          padding: '1px',
          borderRadius: 'inherit',
          background:
            'linear-gradient(135deg, #f3e7cc 0%, #d7b56a 45%, #b8923f 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },
      });
    },
  ],
};
