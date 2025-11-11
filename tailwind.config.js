/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all our React components
  ],
 theme: {
    extend: {
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        'terminal-bg': '#222020ff',
        'terminal-text': '#ffffffff',
        'terminal-header': '#2D2D2D', 
        'page-bg': '#1A202C',
        'card-bg': '#444875ff', // New: For the profile card
        'brand-orange': '#0e0d0dff', // New: The orange from the image
      }
    },
  },
  plugins: [],
}
