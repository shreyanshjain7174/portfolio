/**
 * HalftoneOverlay — Manga printing texture.
 *
 * Renders a fixed full-screen overlay with a halftone dot pattern,
 * simulating the screen printing dots found in manga pages.
 *
 * - Position: fixed (covers entire viewport including during scroll)
 * - Z-index: 10 (above content layers, below modals)
 * - pointer-events: none (never blocks user interaction)
 * - Opacity: very low (0.04) — texture, not obstruction
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
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
        backgroundSize: '6px 6px',
        opacity: 0.04,
        mixBlendMode: 'screen',
      }}
    />
  )
}

export default HalftoneOverlay
