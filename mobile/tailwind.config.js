/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: '#1B1717',
        borders: '#1c1e24',
        gray: '#989c9a',
        'second-gray': '#D8D5DB',
        background: '#F9F7F5',
        'third-background': '#EFEFEF',
        'accent-1': '#d29f22',
        'accent-2': '#A31E21',
        'accent-3': '#4F6815',
        'accent-4': '#0A9396',
        'accent-5': '#F72585',
        'accent-6': '#3A0CA3',
      },
    },
  },
  plugins: [],
};
