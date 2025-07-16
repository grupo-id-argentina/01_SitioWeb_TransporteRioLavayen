import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { ImageCarousel } from "./image-carousel"

export function Partnerships() {
  const benefits = [
    "Tarifas preferenciales para empresas asociadas",
    "Atención personalizada y asesoramiento logístico",
    "Seguimiento en tiempo real de los envíos",
    "Sistema de facturación simplificado",
    "Descuentos por volumen y frecuencia",
  ]

  // Imágenes para el carrusel de convenios y alianzas
  const partnershipImages = [
    {
      src: "/images/team-1.png",
      alt: "Equipo de conductores profesionales - Transporte Río Lavayen",
      title: "Equipo Profesional",
      description: "Nuestros conductores especializados garantizan la seguridad de su carga",
    },
    {
      src: "/images/team-2.png",
      alt: "Agradecimiento a nuestros clientes - Transporte Río Lavayen",
      title: "Nuestros Clientes",
      description: "Gracias a todos nuestros clientes por confiar en nosotros",
    },
    {
      src: "/images/team-3.png",
      alt: "Equipo técnico especializado - Transporte Río Lavayen",
      title: "Soporte Técnico",
      description: "Personal capacitado para brindar el mejor servicio técnico",
    },
  ]

  return (
    <section className="py-16 dark:bg-secondary-800 transition-colors duration-300" id="convenios">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Contenido textual */}
          <div className="lg:w-1/2 animate-slide-up">
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

          {/* Carrusel de imágenes */}
          <div className="lg:w-1/2 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <ImageCarousel
              images={partnershipImages}
              autoPlayInterval={6000}
              showControls={true}
              showIndicators={true}
              className="max-w-2xl mx-auto"
              cardClassName="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
            />
          </div>
        </div>

        {/* Sección adicional de información */}
        <div className="mt-16 text-center">
          <div
            className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-400/10 dark:to-accent-400/10 rounded-2xl p-8 animate-slide-up"
            style={{ animationDelay: "600ms" }}
          >
            <h3 className="text-2xl font-bold mb-4 dark:text-white">¿Por qué elegir nuestras alianzas estratégicas?</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Con más de 30 años de experiencia, hemos construido una red sólida de partners y clientes que confían en
              nuestra capacidad para entregar resultados excepcionales. Nuestro equipo profesional y nuestra flota
              moderna nos permiten ofrecer soluciones logísticas integrales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">30+</div>
                <div className="text-gray-600 dark:text-gray-300">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Clientes satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Atención al cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
