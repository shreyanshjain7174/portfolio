/**
 * CRTOverlay — CRT monitor scanline + film effect.
 *
 * Renders a fixed full-screen overlay with three layers:
 * 1. Scanlines — repeating horizontal bands (0.18 opacity, up from 0.08)
 * 2. Vignette — radial darkening at edges (0.55 at edge, tighter 65% ellipse)
 * 3. Film burn — top/bottom gradient bars simulating film-edge exposure
 *
 * - Position: fixed (covers entire viewport)
 * - Z-index: 11-13 (above halftone, below modals)
 * - pointer-events: none (never blocks user interaction)
 */
export function CRTOverlay() {
  return (
    <>
      {/* Scanlines — dark horizontal bands every 4px */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 11,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          backgroundSize: '100% 4px',
        }}
      />
      {/* Vignette — radial darkening toward screen edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 12,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Film edge burn — top and bottom horizontal gradient bars */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 13,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.25) 100%)',
        }}
      />
    </>
  )
}

export default CRTOverlay
