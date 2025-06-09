import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServicesPage } from "@/components/services-page"

export default function ServiciosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Nuestros Servicios</h1>
        <ServicesPage />
      </div>
      <Footer />
    </main>
  )
}
