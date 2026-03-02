import type { Metadata } from 'next'
import { Bangers, JetBrains_Mono } from 'next/font/google'
import { PageLayout } from '@/components/PageLayout'
import './globals.css'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shreyansh Sancheti',
  description: 'Software Engineer — Distributed Systems, Infrastructure, Open Source',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bangers.variable} ${jetbrainsMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  )
}
