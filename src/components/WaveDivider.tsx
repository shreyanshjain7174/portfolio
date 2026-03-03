/**
 * WaveDivider — SVG ocean wave for section transitions.
 */
export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill="var(--color-sand)"
        />
        <path
          d="M0,80 C360,20 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z"
          fill="var(--color-ocean-light)"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}

export default WaveDivider
