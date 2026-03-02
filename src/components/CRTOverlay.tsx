/**
 * CRTOverlay — CRT monitor scanline effect.
 *
 * Renders a fixed full-screen overlay with repeating horizontal bands,
 * simulating the scanlines visible on CRT monitors and early terminals.
 *
 * - Position: fixed (covers entire viewport)
 * - Z-index: 11 (above halftone, below modals)
 * - pointer-events: none (never blocks user interaction)
 * - Two layered gradients: dark bands + subtle vignette
 */
export function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 11,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          backgroundSize: '100% 4px',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 12,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </>
  )
}

export default CRTOverlay
