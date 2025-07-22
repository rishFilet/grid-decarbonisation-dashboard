/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature-inspired color palette
        'forest': {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5c9',
          300: '#8dd3a8',
          400: '#5bb87f',
          500: '#3a9d5f',
          600: '#2d7d4a',
          700: '#26633d',
          800: '#1f4f32',
          900: '#1a412a',
        },
        'earth': {
          50: '#faf7f2',
          100: '#f3e9d7',
          200: '#e7d3b0',
          300: '#d6b87d',
          400: '#c49a4e',
          500: '#b5833a',
          600: '#a06a2f',
          700: '#84542a',
          800: '#6b4527',
          900: '#573a24',
        },
        'ocean': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'sunset': {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fbd5a5',
          300: '#f8b86d',
          400: '#f59532',
          500: '#f27a0a',
          600: '#e35f05',
          700: '#bc4708',
          800: '#95390e',
          900: '#78300f',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 