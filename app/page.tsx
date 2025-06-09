import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Partnerships } from "@/components/partnerships"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { SectionTracker } from "@/components/section-tracker"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <SectionTracker sectionName="hero">
        <Hero />
      </SectionTracker>
      <SectionTracker sectionName="features">
        <Features />
      </SectionTracker>
      <SectionTracker sectionName="partnerships">
        <Partnerships />
      </SectionTracker>
      <SectionTracker sectionName="contact">
        <Contact />
      </SectionTracker>
      <Footer />
    </main>
  )
}
