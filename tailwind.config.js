const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        lightGreen: "#8DC63F",
        deepGreen: "#00AB4E",
        lightBlue: "#188ECE",
        deepBlue: "#034EA2",
        eRed: "#ED1C24",
        eYellow: "#FFC20E",
        eWhite: "#FFFFFF",
        eGrey: "#d3d3d3",
        eBlack: "#000000",
        texaBlue: "#0a73b7",
        texaRed: "#e92028",
        darkGray: "#333333",
        fireYellow: "#FDA50F",
        cyan: colors.cyan,
        granySmithDeepOne: "#58D05E",
        granySmithDeepTwo: "#7BDA74",
        granySmithLightOne: "#A9E69F",
        granySmithLightTwo: "#CDEEC5",
        granySmithLightThree: "#EEFFE9",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
