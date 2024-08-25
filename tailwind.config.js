/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "torchlight": "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 1) 70%)",
      },
      keyframes: {
        pop: {
          '0%, 100%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
