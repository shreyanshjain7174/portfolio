/**
 * HalftoneOverlay — Manga printing texture.
 *
 * Renders a fixed full-screen overlay with a halftone dot pattern,
 * simulating the screen printing dots found in manga pages.
 *
 * - Position: fixed (covers entire viewport including during scroll)
 * - Z-index: 10 (above content layers, below modals)
 * - pointer-events: none (never blocks user interaction)
 * - Opacity: 0.10 — visible texture without obscuring content
 * - Dot size: 8px grid, 1.5px radius — crisp halftone look on dark backgrounds
 */
export function HalftoneOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
        backgroundSize: '8px 8px',
        opacity: 0.10,
        mixBlendMode: 'screen',
      }}
    />
  )
}

export default HalftoneOverlay
