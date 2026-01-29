/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#2D3436',
        },
        accent: {
          DEFAULT: '#00B894',
        },
        background: '#FAFAFA',
        card: '#FFFFFF',
        muted: '#636E72',
        border: '#DFE6E9',
        // New Design System Colors
        'light-brand-zostel': '#F15A24',
        'light-background-primary': '#FFFFFF',
        'light-background-secondary': '#F4F4F5',
        'light-stroke-primary': '#E4E4E7',
        'light-text-primary': '#18181B',
        'light-text-secondary': '#71717A',
        'light-icon-viewonly': '#A1A1AA',
        'light-status-progress': '#ECEAFF',

        // Dark Mode equivalents (mapping to existing dark palette or distinct)
        'dark-background-primary': '#1E293B',
        'dark-stroke-primary': '#334155',
        'dark-text-primary': '#F8FAFC',
        'dark-status-progress': '#1E1E2E',
      },
      boxShadow: {
        'all-in-one': '0 8px 30px rgba(0,0,0,0.12)',
        'all-in-one-dark': '0 8px 30px rgba(0,0,0,0.4)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
