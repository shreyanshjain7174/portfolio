'use client'

/**
 * SpeedLines — CSS conic-gradient with slow rotation animation.
 * Positioned absolute behind content to create manga-style motion blur.
 */
export function SpeedLines() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute animate-speed-rotate"
        style={{
          top: '50%',
          left: '50%',
          width: '200%',
          height: '200%',
          transform: 'translate(-50%, -50%)',
          background:
            'repeating-conic-gradient(rgba(255,206,0,0.03) 0deg, transparent 1.5deg, transparent 8deg)',
          opacity: 0.6,
        }}
      />
    </div>
  )
}

export default SpeedLines
