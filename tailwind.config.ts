import { type Config } from "tailwindcss";

export default {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // remove unused styles in production
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
