import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { EDUCATION, PERSON, SOCIALS } from '@/content/content'

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })
const body = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body', display: 'swap' })

const title = 'Shreyansh Sancheti, AI Infrastructure Engineer'
const description =
  'Shreyansh Sancheti is an AI infrastructure and platform engineer at Microsoft Azure Compute, building open-source infrastructure for AI agents: Kubernetes, LLM inference, distributed systems. SREcon26 speaker, 15+ merged Ceph PRs.'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['Shreyansh Sancheti', 'AI infrastructure engineer', 'platform engineer', 'Microsoft Azure Compute', 'Kubernetes', 'LLM inference', 'vLLM', 'AI agents', 'Ceph', 'SREcon26', 'Bengaluru'],
  authors: [{ name: PERSON.name, url: 'https://portfolio-ssancheti.vercel.app' }],
  metadataBase: new URL('https://portfolio-ssancheti.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: 'Walk through a personal showroom: a career parked as cars, projects in the workshop, a hall of fame.',
    url: '/',
    siteName: 'Shreyansh Sancheti',
    type: 'profile',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'A 2026 Rolls-Royce Spectre on a turntable in a dark walnut showroom' }],
  },
  twitter: { card: 'summary_large_image', creator: '@shrey_sancheti', title, images: ['/og.jpg'] },
  robots: { index: true, follow: true },
}

// Who this site is about, in the form search engines read.
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PERSON.name,
  url: 'https://portfolio-ssancheti.vercel.app',
  image: 'https://portfolio-ssancheti.vercel.app/og.jpg',
  jobTitle: PERSON.role,
  worksFor: { '@type': 'Organization', name: 'Microsoft' },
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: EDUCATION.school },
  email: `mailto:${PERSON.email}`,
  sameAs: SOCIALS.map((s) => s.url),
  knowsAbout: ['Kubernetes', 'LLM inference', 'vLLM', 'Distributed systems', 'Ceph', 'AI agents', 'Go', 'Rust'],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {children}
      </body>
    </html>
  )
}
