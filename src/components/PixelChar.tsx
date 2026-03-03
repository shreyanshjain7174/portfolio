'use client'

export default function PixelChar() {
  return (
    <div className="relative inline-block px-float">
      {/* ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(123,47,190,0.25) 0%, transparent 70%)',
          transform: 'scale(1.5)',
        }}
        aria-hidden="true"
      />
      {/* 16×16 pixel art character — SVG for crisp rendering */}
      <svg
        viewBox="0 0 16 16"
        width="160"
        height="160"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        aria-label="Pixel art developer character"
      >
        {/* Helmet */}
        <rect x="5" y="1" width="6" height="7" fill="#2A2A5A" />
        {/* Visor */}
        <rect x="5" y="1" width="6" height="1" fill="#7B2FBE" />
        <rect x="4" y="2" width="1" height="5" fill="#7B2FBE" />
        <rect x="11" y="2" width="1" height="5" fill="#7B2FBE" />
        <rect x="5" y="7" width="6" height="1" fill="#7B2FBE" />
        {/* Face */}
        <rect x="5" y="2" width="6" height="5" fill="#E8D5C0" />
        {/* Eyes */}
        <rect x="6" y="3" width="2" height="2" fill="#00F5FF" />
        <rect x="9" y="3" width="2" height="2" fill="#00F5FF" />
        <rect x="6" y="3" width="1" height="1" fill="#004466" />
        <rect x="9" y="3" width="1" height="1" fill="#004466" />
        {/* Smile */}
        <rect x="6" y="6" width="1" height="1" fill="#c47a5a" />
        <rect x="7" y="6" width="2" height="1" fill="#c47a5a" />
        <rect x="9" y="6" width="1" height="1" fill="#c47a5a" />
        {/* Body */}
        <rect x="4" y="8" width="8" height="4" fill="#7B2FBE" />
        {/* Chest detail / code symbol */}
        <rect x="7" y="9" width="3" height="1" fill="#00F5FF" />
        <rect x="6" y="10" width="1" height="1" fill="#00F5FF" />
        <rect x="10" y="10" width="1" height="1" fill="#00F5FF" />
        {/* Arms */}
        <rect x="2" y="8" width="2" height="4" fill="#7B2FBE" />
        <rect x="12" y="8" width="2" height="4" fill="#7B2FBE" />
        {/* Hands */}
        <rect x="2" y="12" width="2" height="1" fill="#E8D5C0" />
        <rect x="12" y="12" width="2" height="1" fill="#E8D5C0" />
        {/* Legs */}
        <rect x="5" y="12" width="2" height="3" fill="#1A1A3E" />
        <rect x="9" y="12" width="2" height="3" fill="#1A1A3E" />
        {/* Boots */}
        <rect x="4" y="14" width="3" height="1" fill="#7B2FBE" />
        <rect x="9" y="14" width="3" height="1" fill="#7B2FBE" />
        {/* Visor glow reflection */}
        <rect x="6" y="4" width="1" height="1" fill="rgba(255,255,255,0.3)" />
        <rect x="10" y="4" width="1" height="1" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  )
}
