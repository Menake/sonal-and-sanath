// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        openSans: ["var(--font-openSans)", ...fontFamily.sans],
        sans: ["var(--font-baskervville)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
