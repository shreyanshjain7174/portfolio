import React from 'react'

export type PanelVariant = 'default' | 'featured' | 'wide' | 'tall' | 'accent' | 'hero'

interface MangaPanelProps {
  children: React.ReactNode
  className?: string
  /** CSS grid column span: 1 (default), 2 (wide), 3 (full-width) */
  colSpan?: 1 | 2 | 3
  /** CSS grid row span: 1 (default), 2 (tall) */
  rowSpan?: 1 | 2
  /** Visual variant affecting border color/weight and background tint */
  variant?: PanelVariant
  /** Optional panel label — renders as a small chapter-style header above the border */
  label?: string
}

// Border classes per variant — dramatic manga-ink asymmetry (heavy left/top, thin right/bottom)
const variantBorders: Record<PanelVariant, string> = {
  default:  'border-l-[5px] border-t-[4px] border-r-[1px] border-b-[2px] border-white',
  featured: 'border-l-[8px] border-t-[6px] border-r-[1px] border-b-[2px] border-white',
  wide:     'border-l-[5px] border-t-[4px] border-r-[1px] border-b-[2px] border-white',
  tall:     'border-l-[5px] border-t-[4px] border-r-[1px] border-b-[2px] border-white',
  accent:   'border-l-[5px] border-t-[4px] border-r-[1px] border-b-[2px] border-[#ff2d55]',
  hero:     'border-l-[8px] border-t-[6px] border-r-[1px] border-b-[2px] border-white',
}

// Subtle background tints — dead-flat #111 was one of the cheap culprits
const variantBg: Record<PanelVariant, string> = {
  default:  'bg-[#111111]',
  featured: 'bg-[#0e1a0e]',   // very subtle green tint
  wide:     'bg-[#111111]',
  tall:     'bg-[#111111]',
  accent:   'bg-[#1a0e0e]',   // very subtle red tint
  hero:     'bg-[#0e1a0e]',   // green tint + speed-lines via inline style
}

// Multi-layer shadows — the original 0.08 rgba shadow was basically invisible
const variantShadow: Record<PanelVariant, string> = {
  default:  'shadow-[4px_4px_0_rgba(255,255,255,0.15),8px_8px_0_rgba(0,0,0,0.5)]',
  featured: 'shadow-[4px_4px_0_rgba(0,255,65,0.2),8px_8px_0_rgba(0,0,0,0.7),inset_0_0_40px_rgba(0,255,65,0.04)]',
  wide:     'shadow-[4px_4px_0_rgba(255,255,255,0.15),8px_8px_0_rgba(0,0,0,0.5)]',
  tall:     'shadow-[4px_4px_0_rgba(255,255,255,0.15),8px_8px_0_rgba(0,0,0,0.5)]',
  accent:   'shadow-[4px_4px_0_rgba(255,45,85,0.25),8px_8px_0_rgba(0,0,0,0.6),inset_0_0_30px_rgba(255,45,85,0.04)]',
  hero:     'shadow-[4px_4px_0_rgba(0,255,65,0.2),8px_8px_0_rgba(0,0,0,0.7),inset_0_0_40px_rgba(0,255,65,0.04)]',
}

/**
 * MangaPanel — Core layout primitive.
 *
 * Renders a manga-style comic panel with bold asymmetric ink borders.
 * Heavy left/top borders (ink pooling) + thin right/bottom (fast stroke).
 *
 * The `hero` variant adds CSS-only speed-lines via repeating-conic-gradient.
 *
 * Usage:
 * ```tsx
 * <div className="manga-grid">
 *   <MangaPanel colSpan={2} label="BOOT SEQUENCE" variant="hero">
 *     content
 *   </MangaPanel>
 *   <MangaPanel variant="accent" label="POWER LEVEL">
 *     content
 *   </MangaPanel>
 * </div>
 * ```
 */
export function MangaPanel({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  variant = 'default',
  label,
}: MangaPanelProps) {
  const colSpanClass =
    colSpan === 3 ? 'col-span-3' : colSpan === 2 ? 'col-span-2' : 'col-span-1'
  const rowSpanClass = rowSpan === 2 ? 'row-span-2' : 'row-span-1'

  // Hero variant: CSS-only speed lines radiating from left-center — no SVG needed
  const heroStyle: React.CSSProperties =
    variant === 'hero'
      ? {
          backgroundImage:
            'repeating-conic-gradient(from 0deg at 15% 50%, transparent 0deg 8.5deg, rgba(0,255,65,0.025) 8.5deg 9deg)',
        }
      : {}

  return (
    <div
      className={[
        'relative',
        variantBg[variant],
        variantBorders[variant],
        variantShadow[variant],
        colSpanClass,
        rowSpanClass,
        'overflow-hidden',
        className,
      ].join(' ')}
      style={heroStyle}
    >
      {label && (
        <div
          className="absolute top-0 left-0 px-2 py-1 uppercase"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: '#00ff41',
            borderBottom: '2px solid rgba(0,255,65,0.3)',
            borderRight: '2px solid rgba(0,255,65,0.3)',
            backgroundColor: '#0d0d0d',
            transform: 'rotate(-0.5deg)',
          }}
        >
          {label}
        </div>
      )}
      <div className={label ? 'mt-7' : ''}>{children}</div>
    </div>
  )
}

/**
 * MangaGrid — Responsive panel grid container.
 *
 * Desktop: 3-column asymmetric grid with 12px gaps
 * Tablet: 2-column grid
 * Mobile: 1-column stacked panels
 */
export function MangaGrid({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'grid',
        'grid-cols-1',        // mobile: 1 column
        'md:grid-cols-2',     // tablet: 2 columns
        'lg:grid-cols-3',     // desktop: 3 columns
        'gap-[12px]',         // --panel-gap
        'auto-rows-[minmax(200px,auto)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export default MangaPanel
