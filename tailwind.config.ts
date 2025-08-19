import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#111111',
        'bg-secondary': '#1a1a1a',
        'border-secondary': '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'accent-red': '#E50914',
        'accent-hover': '#f40612',
        'success': '#10b981',
        'error': '#ef4444',
      },
    },
  },
  plugins: [],
}

export default config