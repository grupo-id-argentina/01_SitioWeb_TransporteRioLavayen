import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PartnershipsPage } from "@/components/partnerships-page"

export default function ConveniosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Convenios y Alianzas Estratégicas</h1>
        <PartnershipsPage />
      </div>
      <Footer />
    </main>
  )
}
