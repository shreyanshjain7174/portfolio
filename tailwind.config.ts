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
        'bg-primary':    '#0a0a0f',
        'bg-secondary':  '#111118',
        'accent-blue':   '#3b82f6',
        'accent-violet': '#8b5cf6',
        'accent-cyan':   '#06b6d4',
        'accent-gold':   '#f59e0b',
        'accent-rose':   '#f43f5e',
        'accent-green':  '#10b981',
        'text-primary':  '#f1f1f4',
        'text-secondary':'#a1a1b5',
        'text-muted':    '#5a5a72',
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'glow-blue':   '0 0 20px rgba(59,130,246,0.15), 0 0 60px rgba(59,130,246,0.05)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.15), 0 0 60px rgba(139,92,246,0.05)',
        'glow-cyan':   '0 0 20px rgba(6,182,212,0.15), 0 0 60px rgba(6,182,212,0.05)',
        'card':        '0 8px 32px rgba(0,0,0,0.3)',
        'card-hover':  '0 16px 48px rgba(0,0,0,0.4), 0 0 20px rgba(139,92,246,0.1)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(8px)' },
        },
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'scroll-bounce':  'scroll-bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
