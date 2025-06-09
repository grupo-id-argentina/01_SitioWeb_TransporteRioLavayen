import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactPage } from "@/components/contact-page"

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Contáctenos</h1>
        <ContactPage />
      </div>
      <Footer />
    </main>
  )
}
