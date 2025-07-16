import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-700 dark:to-accent-700 text-white transition-colors duration-300">
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left animate-slide-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
              Más de 30 años de experiencia en logística y transporte
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0">
              Soluciones logísticas confiables para empresas y particulares. Llegamos a todo el país con la mejor
              relación calidad-precio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/calculadora"
                className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Cotizar Ahora
              </Link>
              <Link
                href="#contacto-form"
                className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              >
                Solicitar Información
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full">
              <Image
                src="/images/hero-composite.png"
                alt="Promociones de Transporte Río Lavayen: Precios, Flota y Nuevas Unidades"
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
