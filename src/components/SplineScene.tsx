'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
    ssr: false,
    loading: () => <SplineFallback />,
})

function SplineFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-48 h-48">
                {/* Animated gradient orbs as fallback */}
                <div
                    className="absolute inset-0 rounded-full animate-pulse-glow"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute inset-4 rounded-full animate-float"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute inset-8 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                        animation: 'float-orb 4s ease-in-out infinite reverse',
                    }}
                />
            </div>
        </div>
    )
}

interface SplineSceneProps {
    scene: string
    className?: string
    style?: React.CSSProperties
}

export default function SplineScene({ scene, className = '', style }: SplineSceneProps) {
    return (
        <div className={`relative ${className}`} style={style}>
            <Suspense fallback={<SplineFallback />}>
                <Spline scene={scene} />
            </Suspense>
        </div>
    )
}

// Export fallback for use when no Spline URL is provided
export { SplineFallback }
