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
        'bg-dark': 'var(--color-bg-dark)',
        'bg-panel': 'var(--color-bg-panel)',
        'terminal-green': 'var(--color-terminal-green)',
        'terminal-green-dim': 'var(--color-terminal-green-dim)',
        'manga-red': 'var(--color-manga-red)',
        'manga-red-dim': 'var(--color-manga-red-dim)',
        'manga-yellow': 'var(--color-manga-yellow)',
        'manga-yellow-dim': 'var(--color-manga-yellow-dim)',
        'ink': 'var(--color-ink)',
        'ink-dim': 'var(--color-ink-dim)',
      },
      fontFamily: {
        manga: ['var(--font-manga)', 'Bangers', 'cursive'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      boxShadow: {
        'terminal': '0 0 10px var(--color-terminal-green), 0 0 20px var(--color-terminal-green-dim)',
        'manga-red': '0 0 10px var(--color-manga-red), 0 0 20px var(--color-manga-red-dim)',
        'ink': '4px 4px 0px var(--color-ink)',
        'impact': '0 0 0 3px #000, 4px 4px 0 rgba(255,215,0,0.5)',
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, var(--color-ink-dim) 1px, transparent 1px)',
        'scanline': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
      },
      backgroundSize: {
        'halftone': '6px 6px',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px var(--color-terminal-green)' },
          '50%': { boxShadow: '0 0 20px var(--color-terminal-green), 0 0 40px var(--color-terminal-green-dim)' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
