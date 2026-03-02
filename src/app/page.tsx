import { MangaGrid, MangaPanel } from '@/components/MangaPanel'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <MangaGrid>
        <MangaPanel colSpan={2} label="SYSTEM INIT" variant="featured">
          <div className="p-6 h-48 flex flex-col justify-center">
            <h1
              className="text-5xl md:text-7xl uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-manga, Bangers, cursive)',
                color: '#00ff41',
                textShadow: '0 0 10px #00ff41, 0 0 20px rgba(0,255,65,0.3)',
              }}
            >
              SHREYANSH SANCHETI
            </h1>
            <p
              className="mt-2 text-sm tracking-[0.3em] uppercase"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              &gt; system.boot() — initializing...
            </p>
          </div>
        </MangaPanel>

        <MangaPanel label="STATUS" variant="accent">
          <div className="p-4 h-48 flex items-center justify-center">
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#00ff41',
                fontSize: '0.75rem',
              }}
            >
              [ACTIVE]
            </span>
          </div>
        </MangaPanel>

        <MangaPanel>
          <div className="p-4 h-48" />
        </MangaPanel>

        <MangaPanel colSpan={2}>
          <div className="p-4 h-48" />
        </MangaPanel>
      </MangaGrid>
    </main>
  )
}
