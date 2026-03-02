import { HalftoneOverlay } from './HalftoneOverlay'
import { CRTOverlay } from './CRTOverlay'

interface PageLayoutProps {
  children: React.ReactNode
}

/**
 * PageLayout — Root layout wrapper.
 *
 * Applies the two global visual overlays (halftone + CRT scanlines)
 * and provides the base dark background. All page content renders
 * inside the children slot at z-index 1 (below overlays).
 *
 * Use in src/app/layout.tsx to wrap {children}.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0d0d0d',
        color: '#ffffff',
      }}
    >
      {/* Visual overlays — fixed, pointer-events: none */}
      <HalftoneOverlay />
      <CRTOverlay />

      {/* Page content — z-index 1 ensures content is below overlays but clickable */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

export default PageLayout
