'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// The way in: a count while the rooms are lit, then one button. On press the
// screen parts into eight blinds and the doors open behind it. (Blind split
// adapted from the 21st.dev "Swiss Poster Counter Preloader" pattern.)

const BLINDS = 8

export function Loader({ ready, onEnter, pieces }: { ready: boolean; onEnter: () => void; pieces: { done: number; total: number } | null }) {
  const [count, setCount] = useState(0)
  const [pressed, setPressed] = useState(false)
  const done = count >= 100
  const gone = pressed && ready

  useEffect(() => {
    if (count >= 100) return
    const t = setTimeout(() => setCount((c) => Math.min(100, c + Math.max(1, Math.round((100 - c) / 9)))), 32)
    return () => clearTimeout(t)
  }, [count])

  const enter = () => {
    if (!done || pressed) return
    setPressed(true)
    onEnter()
  }

  useEffect(() => {
    if (!done) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Enter') enter() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })

  return (
    <AnimatePresence>
      {!gone ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex"
          exit={{ pointerEvents: 'none' }}
          transition={{ duration: 1.4 }}
          role="dialog"
          aria-label="Enter Shreyansh's world"
        >
          {Array.from({ length: BLINDS }, (_, i) => (
            <motion.span
              key={i}
              className="h-full flex-1 bg-ground"
              exit={{ y: i % 2 ? '-101%' : '101%' }}
              transition={{ duration: 1.1, delay: 0.05 * Math.abs(i - (BLINDS - 1) / 2), ease: [0.76, 0, 0.24, 1] }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <p className="text-[15px] text-muted">Shreyansh Sancheti</p>
            <p className="mt-5 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
              Enter Shreyansh&apos;s <em>world</em>
            </p>
            <div className="mt-14 h-28">
              <AnimatePresence mode="wait">
                {done && !pressed ? (
                  <motion.button
                    key="start"
                    type="button"
                    onClick={enter}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="group relative grid h-28 w-28 place-items-center rounded-full border border-ink/40 text-[15px]"
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-[-10px] rounded-full border border-warm/50"
                      animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="leading-tight">Press to<br />enter</span>
                  </motion.button>
                ) : pressed ? (
                  <motion.p key="opening" initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="pt-10 text-[15px]" aria-live="polite">
                    Opening the doors
                  </motion.p>
                ) : (
                  <motion.p key="count" exit={{ opacity: 0 }} className="tnum font-display text-6xl" aria-live="polite">
                    {count}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-8 text-[15px] text-muted">{pressed ? 'One moment' : done ? 'The lights are on. Press Enter or the button.' : 'Lighting the showroom'}
              {pieces && pieces.total ? <span className="tnum"> · {pieces.done} of {pieces.total} pieces on the floor</span> : null}</p>
            <a href="/plain" className="mt-10 text-[15px] underline underline-offset-4 hover:text-warm">Skip to the plain view</a>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
