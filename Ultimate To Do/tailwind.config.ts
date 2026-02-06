import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tracker-red': '#f87171',
        'tracker-yellow': '#fbbf24',
        'tracker-light-green': '#86efac',
        'tracker-deep-green': '#16a34a',
      },
    },
  },
  plugins: [],
} satisfies Config
