module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937', // Dark background
        secondary: '#f3f4f6', // Light text
        accent: '#f6851b', // MetaMask orange
        success: '#28a745', // Green
        danger: '#dc3545', // Red
        info: '#007bff', // Blue for buttons
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px 0 rgba(255, 255, 255, 0.5)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
