import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: 'rgb(var(--ground) / <alpha-value>)',
        step: 'rgb(var(--step) / <alpha-value>)',
        step2: 'rgb(var(--step2) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        warm: 'rgb(var(--warm) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'marquee-x': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(calc(-100% / var(--marquee-copies)))' } },
        'marquee-y': { from: { transform: 'translateY(0)' }, to: { transform: 'translateY(calc(-100% / var(--marquee-copies)))' } },
      },
      animation: {
        'marquee-x': 'marquee-x linear infinite',
        'marquee-y': 'marquee-y linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
