import type { Metadata } from 'next'
import './globals.css'
import { LenisProvider } from '@/components/LenisProvider'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import PixelCursor from '@/components/PixelCursor'

export const metadata: Metadata = {
  title: 'Shreyansh Sancheti — Full Stack Developer',
  description: 'Portfolio of Shreyansh Sancheti, full stack developer. Pixel art meets clean code.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-px-bg">
        <LenisProvider>
          <ScanlineOverlay />
          <PixelCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
