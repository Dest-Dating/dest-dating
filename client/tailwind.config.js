/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/flowbite-react/lib/esm/**/*.js"], theme: {
    extend: {
      fontFamily: {
        handwritten: ["Dancing Script", "cursive"],
      }
    },
  }, plugins: [require("flowbite/plugin"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
