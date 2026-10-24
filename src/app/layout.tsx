import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import './globals.css'

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })
const body = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'Shreyansh Sancheti, AI Infrastructure Engineer',
  description:
    'AI Infrastructure / Platform Engineer at Microsoft Azure Compute. Kubernetes, LLM inference, distributed systems and AI agent tooling. 15+ merged Ceph PRs.',
  keywords: ['Shreyansh Sancheti', 'AI Infrastructure', 'Platform Engineer', 'Kubernetes', 'LLM inference', 'vLLM', 'Ceph', 'Azure'],
  metadataBase: new URL('https://portfolio-ssancheti.vercel.app'),
  openGraph: {
    title: 'Shreyansh Sancheti, AI Infrastructure Engineer',
    description: 'Step into a personal showroom: a career parked as cars, projects kept in a wardrobe, skills in a drawer.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#09090B' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
