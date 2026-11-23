/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#176B52',
          hover: '#125640',
          pressed: '#0E4634',
          soft: '#E8F4EF',
          foreground: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F1F5F9',
        },
        border: '#E2E8F0',
        text: {
          primary: '#17212B',
          secondary: '#526170',
          muted: '#718096',
        },
        neutral: {
          disabled: '#CBD5E1',
        },
        success: {
          DEFAULT: '#15803D',
          soft: '#DCFCE7',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#A16207',
          soft: '#FEF3C7',
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#B91C1C',
          soft: '#FEE2E2',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#0369A1',
          soft: '#E0F2FE',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
