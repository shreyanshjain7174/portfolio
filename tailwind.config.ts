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
        'sky':          'var(--color-sky)',
        'sky-deep':     'var(--color-sky-deep)',
        'ocean':        'var(--color-ocean)',
        'ocean-light':  'var(--color-ocean-light)',
        'sand':         'var(--color-sand)',
        'luffy-red':    'var(--color-luffy-red)',
        'gold':         'var(--color-gold)',
        'text-dark':    'var(--color-text-dark)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bangers', 'cursive'],
        body:    ['var(--font-body)', 'Poppins', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderWidth: { '3': '3px', '4': '4px' },
      boxShadow: {
        'red-glow':    '0 0 12px rgba(215,0,0,0.35), 0 0 24px rgba(215,0,0,0.15)',
        'gold-glow':   '0 0 12px rgba(255,215,0,0.35), 0 0 24px rgba(255,215,0,0.15)',
        'poster':      '6px 6px 0px rgba(0,0,0,0.15), 8px 8px 20px rgba(0,0,0,0.1)',
        'poster-hover':'8px 8px 0px rgba(0,0,0,0.2), 12px 12px 30px rgba(0,0,0,0.15)',
      },
      keyframes: {
        'bounce-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(12px)' },
        },
        'wave-pan': {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'bounce-down': 'bounce-down 2s ease-in-out infinite',
        'wave-pan':    'wave-pan 20s linear infinite alternate',
        'float':       'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
