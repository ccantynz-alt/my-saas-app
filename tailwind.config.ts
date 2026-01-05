// tailwind.config.ts
// NOTE: We avoid importing types from "tailwindcss" to prevent build/typecheck
// failures when tailwindcss is not installed in this repo.

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
