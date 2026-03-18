import type { Metadata } from 'next'
import './globals.css'
import { LenisProvider } from '@/components/LenisProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Shreyansh Sancheti — Full Stack Developer & Builder',
  description: 'Portfolio of Shreyansh Sancheti. Building products at the intersection of design, code, and AI. Full stack developer specializing in React, Next.js, TypeScript, and cloud-native systems.',
  keywords: ['Shreyansh Sancheti', 'Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Portfolio'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-[#0a0a0f] text-black dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
