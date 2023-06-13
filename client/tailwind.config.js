/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Mulish: ["Mulish", "sans-serif"],
      },
      backgroundImage: {
        "login-bg": "url('https://s8.uupload.ir/files/login-bg_chf.jpg')",
      },
    },
  },
  plugins: [],
};
