import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export function Partnerships() {
  const benefits = [
    "Tarifas preferenciales para empresas asociadas",
    "Atención personalizada y asesoramiento logístico",
    "Seguimiento en tiempo real de los envíos",
    "Sistema de facturación simplificado",
    "Descuentos por volumen y frecuencia",
  ]

  return (
    <section className="py-16 dark:bg-secondary-800 transition-colors duration-300" id="convenios">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 animate-slide-up">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Alianzas estratégicas"
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="md:w-1/2 animate-slide-up">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Convenios y Alianzas Estratégicas</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Establecemos relaciones comerciales duraderas con nuestros clientes y partners. Nuestros convenios están
              diseñados para optimizar costos y mejorar la eficiencia en la cadena logística.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/convenios"
              className="inline-block bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
