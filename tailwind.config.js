/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./packages/design-tokens/src/lib/tailwind.preset')],
  content: [
    './apps/**/*.{html,ts}',
    './packages/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
