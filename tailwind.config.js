// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E76FD", // Custom primary color
      },
      backgroundImage: {
        hero: "url('/bg/hero.jpg')", // Place image in public/bg/hero.jpg
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
