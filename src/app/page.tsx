'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PixelNav from '@/components/PixelNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'
import RunnerChar from '@/components/RunnerChar'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useEffect(() => {
    // TV-on intro: white bar collapses then fades out
    const overlay = document.getElementById('tv-overlay')
    if (!overlay) return
    gsap.timeline()
      .fromTo(overlay,
        { scaleY: 1, opacity: 1 },
        { scaleY: 0.015, duration: 0.35, ease: 'power4.out', delay: 0.15 }
      )
      .to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.out' })
      .set(overlay, { display: 'none' })
  }, [])

  return (
    <>
      {/* TV turn-on flash */}
      <div
        id="tv-overlay"
        className="fixed inset-0 bg-white z-[99999]"
        style={{ transformOrigin: 'center center' }}
        aria-hidden="true"
      />

      <PixelNav />
      <RunnerChar />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  )
}
