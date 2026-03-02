import { MangaGrid, MangaPanel } from '@/components/MangaPanel'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <MangaGrid>

        {/* ── Panel 1: Hero / Boot Sequence ─────────────────────────────────── */}
        <MangaPanel colSpan={2} label="BOOT SEQUENCE" variant="hero">
          <div className="p-6 flex flex-col justify-center gap-3">
            <h1
              style={{
                fontFamily: 'var(--font-manga, Bangers, cursive)',
                color: '#00ff41',
                textShadow:
                  '0 0 10px #00ff41, 0 0 25px rgba(0,255,65,0.4), 0 0 50px rgba(0,255,65,0.15)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              SHREYANSH SANCHETI
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              SOFTWARE ENGINEER · DISTRIBUTED SYSTEMS · OSS TROUBLEMAKER
            </p>

            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
              }}
            >
              <p style={{ color: 'rgba(0,255,65,0.6)' }}>
                {'$'} sudo hire_me --force --no-regrets
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                [██████████] 100%&nbsp;&nbsp;—&nbsp;&nbsp;FULLY LOADED
              </p>
            </div>
          </div>
        </MangaPanel>

        {/* ── Panel 2: Power Level ──────────────────────────────────────────── */}
        <MangaPanel label="POWER LEVEL" variant="accent">
          <div
            className="p-5 flex flex-col gap-2"
            style={{ minHeight: '200px' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#ff2d55',
                fontSize: '1.6rem',
                letterSpacing: '0.05em',
                textShadow: '0 0 10px rgba(255,45,85,0.4)',
              }}
            >
              ████████░░
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.85rem',
              }}
            >
              9,500 / 10,000
            </p>

            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#FFD700',
                fontSize: '0.75rem',
                textShadow: '0 0 8px rgba(255,215,0,0.5)',
                letterSpacing: '0.1em',
                marginTop: '0.25rem',
              }}
            >
              ⚡ BOSS MODE: APPROACHING
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#00ff41',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  border: '1px solid rgba(0,255,65,0.4)',
                  padding: '2px 8px',
                  textShadow: '0 0 6px rgba(0,255,65,0.5)',
                }}
              >
                [ACTIVE]
              </span>
            </div>
          </div>
        </MangaPanel>

        {/* ── Panel 3: Active Side Quests ───────────────────────────────────── */}
        <MangaPanel colSpan={3} label="ACTIVE SIDE QUESTS" variant="default">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Quest 1 */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #001
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Make Kubernetes do something useful
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: SHIP IT OR YOLO
                </p>
              </div>

              {/* Quest 2 */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #002
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Convince distributed systems to just... agree
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: ETERNAL NEGOTIATION
                </p>
              </div>

              {/* Quest 3 */}
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  borderLeft: '2px solid rgba(0,255,65,0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <p
                  style={{
                    color: '#ff2d55',
                    fontSize: '0.7rem',
                    marginBottom: '0.4rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  [!] QUEST #003
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                  }}
                >
                  Write code humans can actually read
                </p>
                <p
                  style={{
                    color: 'rgba(0,255,65,0.5)',
                    fontSize: '0.65rem',
                    marginTop: '0.5rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  STATUS: ONGOING (ง •̀_•́)ง
                </p>
              </div>

            </div>

            {/* Footer — current status line */}
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: '#FFD700',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                textShadow: '0 0 8px rgba(255,215,0,0.4)',
              }}
            >
              {'>'} current_status:{' '}
              <span style={{ color: '#00ff41', textShadow: '0 0 6px rgba(0,255,65,0.4)' }}>
                &quot;CAUSING PRODUCTIVE CHAOS&quot;
              </span>
            </div>
          </div>
        </MangaPanel>

      </MangaGrid>
    </main>
  )
}
