'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
]

export default function GlassNav() {
    const navRef = useRef<HTMLElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const lastScroll = useRef(0)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY
            setScrolled(y > 50)
            setHidden(y > lastScroll.current && y > 200)
            lastScroll.current = y

            // Progress bar
            if (progressRef.current) {
                const docH = document.documentElement.scrollHeight - window.innerHeight
                const pct = docH > 0 ? (y / docH) * 100 : 0
                progressRef.current.style.width = `${pct}%`
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTo = (id: string) => {
        setMobileOpen(false)
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
            style={{
                transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
                background: scrolled ? 'rgba(10, 10, 15, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
            }}
        >
            {/* Progress bar */}
            <div
                ref={progressRef}
                className="absolute bottom-0 left-0 h-[2px]"
                style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                    width: '0%',
                    transition: 'width 0.1s linear',
                }}
            />

            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="font-display font-bold text-lg tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                >
                    <span className="gradient-text">SS</span>
                    <span className="text-text-muted ml-1 text-sm font-normal hidden sm:inline">· developer</span>
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(link => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="text-sm font-medium transition-colors duration-200 hover:text-accent-violet"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {link.label}
                        </button>
                    ))}
                    <a
                        href="https://drive.google.com/file/d/11kGCOTg9Xni6qq5fhO6AUCCtwVomouOD/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: 13 }}
                    >
                        Resume
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-[5px] p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                >
                    <span
                        className="block w-5 h-[2px] bg-white transition-transform duration-300"
                        style={{ transform: mobileOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }}
                    />
                    <span
                        className="block w-5 h-[2px] bg-white transition-opacity duration-300"
                        style={{ opacity: mobileOpen ? 0 : 1 }}
                    />
                    <span
                        className="block w-5 h-[2px] bg-white transition-transform duration-300"
                        style={{ transform: mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className="md:hidden overflow-hidden transition-all duration-300"
                style={{
                    maxHeight: mobileOpen ? 300 : 0,
                    background: 'rgba(10, 10, 15, 0.95)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="px-6 py-4 flex flex-col gap-4">
                    {NAV_LINKS.map(link => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="text-left text-sm font-medium py-2"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {link.label}
                        </button>
                    ))}
                    <a
                        href="https://drive.google.com/file/d/11kGCOTg9Xni6qq5fhO6AUCCtwVomouOD/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-center"
                        style={{ padding: '10px', fontSize: 13 }}
                    >
                        Resume
                    </a>
                </div>
            </div>
        </nav>
    )
}
