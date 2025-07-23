/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - warm, bookish theme
        primary: {
          50: '#fef7ee',
          100: '#fdead4',
          200: '#fad2a8',
          300: '#f6b371',
          400: '#f08b38',
          500: '#ec6b16',
          600: '#dd520c',
          700: '#b83d0c',
          800: '#933012',
          900: '#762912',
          950: '#401207',
        },
        // Secondary colors - harmonized with primary (deeper amber/burnt orange)
        secondary: {
          50: '#fef6ee',
          100: '#fdeadc',
          200: '#fbd1b8',
          300: '#f7b189',
          400: '#f28958',
          500: '#ee6935',
          600: '#df4f1f',
          700: '#b93c1b',
          800: '#94321e',
          900: '#762b1c',
          950: '#40140b',
        },
        // Neutral colors - warm grays
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Accent colors - variations of primary theme
        accent: {
          gold: '#f59e0b',      // Slightly more yellow-gold (similar to your primary but more golden)
          emerald: '#ea580c',   // Orange-red variation of your primary
          rose: '#dc2626',      // Deep red that complements orange
          amber: '#ec6b16',     // Your primary color as amber accent
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}


// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

