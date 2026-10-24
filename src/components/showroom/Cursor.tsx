'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

type Props = {
  /** what the pointer is over in the room, said beside the glove */
  label: string | null
  /** 'drag' while turning a piece around */
  mode: 'drag' | null
}

const INK = '#1b1714'
const GLOVE = '#f6f1e7'

// the cuff and the three stitched lines on the back of the hand, shared by every pose
function Cuff({ x = 8.6 }: { x?: number }) {
  return (
    <>
      <path d="M12 20.4v5.2M16 20.8v5M20 21.4v4.6" stroke={INK} strokeOpacity=".35" fill="none" />
      <rect x={x} y="28.6" width="15.4" height="8.4" rx="2" />
      <path d={`M${x} 31.4h15.4`} fill="none" strokeOpacity=".45" />
    </>
  )
}

// A butler's white glove, drawn for the pointer. The tip of the index finger is the hotspot.
function Pointing() {
  return (
    <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round" fill={GLOVE}>
      <path d="M7.2 15V4.6a2.9 2.9 0 0 1 5.8 0V15z" />
      <circle cx="15.6" cy="15.6" r="2.9" />
      <circle cx="20.4" cy="16.4" r="2.7" />
      <circle cx="24.1" cy="18.6" r="2.3" />
      <rect x="6.6" y="14.2" width="19.6" height="16" rx="6" />
      <path d="M8.4 19.6c-3.6-1.4-6 .4-5.6 2.8.4 2 2.6 3.6 5.6 4.6z" />
      <Cuff />
    </g>
  )
}

// fingers curled round whatever it is holding
function Holding() {
  return (
    <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round" fill={GLOVE}>
      <circle cx="10.4" cy="15.4" r="2.9" />
      <circle cx="15.6" cy="14.8" r="2.9" />
      <circle cx="20.4" cy="15.6" r="2.7" />
      <circle cx="24.1" cy="18" r="2.3" />
      <rect x="6.6" y="14.2" width="19.6" height="16" rx="6" />
      <path d="M8.4 19.6c-3.6-1.4-6 .4-5.6 2.8.4 2 2.6 3.6 5.6 4.6z" />
      <Cuff />
    </g>
  )
}

// an open hand, ready to take hold and turn
function Open() {
  return (
    <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round" fill={GLOVE}>
      <path d="M8.4 15V6.4a2.4 2.4 0 0 1 4.8 0V15z" />
      <path d="M13.2 14V3.8a2.4 2.4 0 0 1 4.8 0V14z" />
      <path d="M18 14.6V5.4a2.4 2.4 0 0 1 4.8 0v9.2z" />
      <path d="M22.8 16.4V8.8a2.2 2.2 0 0 1 4.4 0v8.2z" />
      <rect x="7.4" y="13.6" width="19.8" height="16.6" rx="6" />
      <path d="M8.8 19.2c-3.8-3-6.8-2.2-6.6.4.2 2 2.8 4.8 6.6 7z" />
      <Cuff x={9.2} />
    </g>
  )
}

// A white glove for a mouse. Over something you can open, a small card beside it says what it is.
// Touch screens keep their own.
export function Cursor({ label, mode }: Props) {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  const [overLink, setOverLink] = useState(false)
  const [overScene, setOverScene] = useState(false)
  const [down, setDown] = useState(false)
  const [shown, setShown] = useState(false)
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const tag = { stiffness: 420, damping: 38, mass: 0.6 }
  const lx = useSpring(x, reduce ? { stiffness: 10000, damping: 1000 } : tag)
  const ly = useSpring(y, reduce ? { stiffness: 10000, damping: 1000 } : tag)

  useEffect(() => {
    const mq = matchMedia('(pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync(); mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!fine) return
    document.documentElement.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX); y.set(e.clientY); setShown(true)
      if (e.buttons === 0) setDown(false)
      const el = e.target as Element | null
      setOverLink(!!el?.closest?.('a, button, [role="tab"], [role="radio"], input, label'))
      setOverScene(el?.tagName === 'CANVAS')
    }
    const leave = () => setShown(false)
    const d = () => setDown(true), u = () => setDown(false)
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    addEventListener('pointerdown', d); addEventListener('pointerup', u); addEventListener('pointercancel', u); addEventListener('blur', u)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      removeEventListener('pointerdown', d); removeEventListener('pointerup', u); removeEventListener('pointercancel', u); removeEventListener('blur', u)
    }
  }, [fine, x, y])

  if (!fine) return null
  const dragging = mode === 'drag' && overScene && !overLink
  // the room's labels only apply while the pointer is over the room itself, not a panel above it
  const text = overScene && !overLink && !dragging ? label : null
  const hand = dragging ? (down ? 'holding' : 'open') : 'pointing'
  const offering = overLink || !!text

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]" style={{ opacity: shown ? 1 : 0, transition: 'opacity .2s' }}>
      <AnimatePresence>
        {text ? (
          <motion.div key="tag" className="absolute left-0 top-0" style={{ x: lx, y: ly }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={text}
                className="ml-7 mt-8 whitespace-nowrap bg-ink px-3 py-1.5 text-[14px] text-ground"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        {/* the hotspot is the fingertip, at about (8, 1) of the drawn glove */}
        <motion.svg
          width="26" height="32" viewBox="0 0 32 40"
          className="-ml-[8px] -mt-[1px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)]"
          style={{ transformOrigin: '30% 10%' }}
          animate={{ rotate: offering && hand === 'pointing' ? -10 : 0, scale: down ? 0.9 : offering ? 1.06 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {hand === 'pointing' ? <Pointing /> : hand === 'holding' ? <Holding /> : <Open />}
        </motion.svg>
      </motion.div>
    </div>
  )
}
