module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        secondary: '#FB923C',
        accent: '#3B82F6',
        bg: '#FFFFFF',
        text: '#1F2937',
        success: '#10B981',
        error: '#EF4444'
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
