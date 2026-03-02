import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ocean-deep': 'var(--color-ocean-deep)',
        'ocean-dark': 'var(--color-ocean-dark)',
        'luffy-red': 'var(--color-luffy-red)',
        'luffy-red-dim': 'var(--color-luffy-red-dim)',
        'gold': 'var(--color-gold)',
        'gold-dim': 'var(--color-gold-dim)',
        'sky-blue': 'var(--color-sky-blue)',
        'sky-blue-dim': 'var(--color-sky-blue-dim)',
        'bronze': 'var(--color-bronze)',
        'glass': 'var(--color-glass)',
        'glass-border': 'var(--color-glass-border)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bangers', 'cursive'],
        body: ['var(--font-body)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'red-glow': '0 0 12px rgba(215,0,0,0.35), 0 0 24px rgba(215,0,0,0.15)',
        'gold-glow': '0 0 12px rgba(255,206,0,0.35), 0 0 24px rgba(255,206,0,0.15)',
        'blue-glow': '0 0 12px rgba(96,191,245,0.35), 0 0 24px rgba(96,191,245,0.15)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(215,0,0,0.2)',
        'poster': '4px 4px 0px rgba(0,0,0,0.5), 8px 8px 20px rgba(0,0,0,0.3)',
        'poster-hover': '6px 6px 0px rgba(0,0,0,0.5), 12px 12px 30px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'bounce-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(12px)' },
        },
        'speed-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'glow-pulse-red': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(215,0,0,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(215,0,0,0.5), 0 0 40px rgba(215,0,0,0.2)' },
        },
        'glow-pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,206,0,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,206,0,0.5), 0 0 40px rgba(255,206,0,0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'bounce-down': 'bounce-down 2s ease-in-out infinite',
        'speed-rotate': 'speed-rotate 60s linear infinite',
        'glow-pulse-red': 'glow-pulse-red 2s ease-in-out infinite',
        'glow-pulse-gold': 'glow-pulse-gold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
