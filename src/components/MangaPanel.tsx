import React from 'react'

export type PanelVariant = 'default' | 'featured' | 'wide' | 'tall' | 'accent'

interface MangaPanelProps {
  children: React.ReactNode
  className?: string
  /** CSS grid column span: 1 (default), 2 (wide), 3 (full-width) */
  colSpan?: 1 | 2 | 3
  /** CSS grid row span: 1 (default), 2 (tall) */
  rowSpan?: 1 | 2
  /** Visual variant affecting border color/weight */
  variant?: PanelVariant
  /** Optional panel label — renders as a small chapter-style header above the border */
  label?: string
}

const variantStyles: Record<PanelVariant, string> = {
  default: 'border-white',
  featured: 'border-white border-l-[5px] border-t-[5px]',
  wide: 'border-white',
  tall: 'border-white',
  accent: 'border-[#ff2d55]',
}

/**
 * MangaPanel — Core layout primitive.
 *
 * Renders a manga-style comic panel with hand-drawn ink borders.
 * Asymmetry is achieved by varying border widths per side.
 *
 * Usage:
 * ```tsx
 * <div className="manga-grid">
 *   <MangaPanel colSpan={2} label="CHAPTER 01">
 *     content
 *   </MangaPanel>
 *   <MangaPanel variant="accent">
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

  return (
    <div
      className={[
        'relative',
        'bg-[#111111]',
        // Asymmetric ink borders — manga panels have slightly uneven borders
        'border-l-[3px] border-t-[3px] border-r-[2px] border-b-[2px]',
        variantStyles[variant],
        // Drop shadow offset to reinforce ink/print aesthetic
        'shadow-[3px_3px_0px_rgba(255,255,255,0.08)]',
        colSpanClass,
        rowSpanClass,
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      {label && (
        <div
          className="absolute top-0 left-0 px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            color: '#00ff41',
            borderBottom: '1px solid rgba(0,255,65,0.3)',
            borderRight: '1px solid rgba(0,255,65,0.3)',
            backgroundColor: '#0d0d0d',
          }}
        >
          {label}
        </div>
      )}
      <div className={label ? 'mt-6' : ''}>{children}</div>
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
