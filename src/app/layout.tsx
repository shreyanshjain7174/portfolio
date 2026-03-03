import type { Metadata } from 'next'
import { Bangers, JetBrains_Mono, Poppins } from 'next/font/google'
import { LenisProvider } from '@/components/LenisProvider'
import './globals.css'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sunny Gade — Infrastructure Engineer',
  description: 'Software Engineer specializing in Distributed Systems, Infrastructure & Open Source.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ margin: 0, padding: 0 }}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
