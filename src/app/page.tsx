'use client'
import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PixelNav from '@/components/PixelNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'
import RunnerChar from '@/components/RunnerChar'
import PlayerIntro from '@/components/PlayerIntro'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [introVisible, setIntroVisible] = useState(true)

  const handleIntroDismiss = () => {
    setIntroVisible(false)
    // TV-on flash into hero
    const overlay = document.getElementById('tv-overlay')
    if (!overlay) return
    gsap.timeline()
      .fromTo(overlay,
        { scaleY: 0.015, opacity: 1, display: 'block' },
        { scaleY: 0, duration: 0.2, ease: 'power4.out' }
      )
      .set(overlay, { display: 'none' })
  }

  return (
    <>
      {/* TV overlay (used for intro→hero transition) */}
      <div
        id="tv-overlay"
        className="fixed inset-0 bg-white z-[99997]"
        style={{ transformOrigin: 'center center', display: 'none' }}
        aria-hidden="true"
      />

      {/* Player intro overlay */}
      {introVisible && <PlayerIntro onDismiss={handleIntroDismiss} />}

      {/* Main portfolio (always rendered, behind intro) */}
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
