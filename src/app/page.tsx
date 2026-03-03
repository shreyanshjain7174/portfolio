import { VoyageHero }      from '@/components/VoyageHero'
import { ShipArrival }     from '@/components/ShipArrival'
import { CharacterIntro }  from '@/components/CharacterIntro'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection  from '@/components/ContactSection'

export default function Home() {
  return (
    <main>
      <VoyageHero />
      <ShipArrival />
      <CharacterIntro />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
