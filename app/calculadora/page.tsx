import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calculator } from "@/components/calculator"

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Cotizar Ahora</h1>
        <Calculator />
      </div>
      <Footer />
    </main>
  )
}
