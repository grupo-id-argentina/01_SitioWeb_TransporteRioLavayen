import { Truck, Clock, Shield, Map, BarChart, Users } from "lucide-react"
import { ImageCarousel } from "./image-carousel"

export function Features() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Flota Moderna",
      description: "Contamos con una flota de vehículos moderna y adaptada a diferentes tipos de carga.",
    },
    {
      icon: <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Puntualidad",
      description: "Nos comprometemos con los plazos de entrega para que su mercancía llegue siempre a tiempo.",
    },
    {
      icon: <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Seguridad",
      description: "Su carga está asegurada durante todo el proceso de transporte.",
    },
    {
      icon: <Map className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Cobertura Nacional",
      description: "Llegamos a todo el territorio nacional con nuestras rutas estratégicamente planificadas.",
    },
    {
      icon: <BarChart className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Eficiencia",
      description: "Optimizamos recursos para ofrecer el mejor servicio al mejor precio.",
    },
    {
      icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600 dark:text-primary-400" />,
      title: "Experiencia",
      description: "Más de 30 años de experiencia en el sector del transporte y la logística.",
    },
  ]

  // Imágenes para el carrusel de promociones
  const promoImages = [
    {
      src: "/images/promo-1.png",
      alt: "Promoción 3% OFF adicional - Transporte Río Lavayen",
      title: "Oferta Especial",
      description: "3% OFF adicional en todos nuestros servicios",
    },
    {
      src: "/images/promo-2.png",
      alt: "Nuevos depósitos - Transporte Río Lavayen",
      title: "Nuevos Depósitos",
      description: "Ampliamos nuestra cobertura con nuevas ubicaciones",
    },
    {
      src: "/images/promo-3.png",
      alt: "Nuevas unidades - Transporte Río Lavayen",
      title: "Flota Renovada",
      description: "Nuevas unidades para un mejor servicio",
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-secondary-900 transition-colors duration-300" id="servicios">
      <div className="container mx-auto px-4">
        {/* Título principal */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">Nuestros Servicios</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Ofrecemos soluciones integrales de transporte y logística adaptadas a sus necesidades específicas.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-secondary-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 sm:mb-4 transform transition-transform duration-300 hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Sección "Más de 30 años en el mercado" con carrusel */}
        <div className="mb-16">
          <div className="text-center mb-8 animate-fade-in">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">Más de 30 Años en el Mercado</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
              Tres décadas de experiencia nos respaldan. Descubre nuestras promociones especiales y la evolución
              constante de nuestros servicios para brindarte siempre lo mejor en transporte y logística.
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <ImageCarousel
              images={promoImages}
              autoPlayInterval={5000}
              showControls={true}
              showIndicators={true}
              className="max-w-4xl mx-auto"
              cardClassName="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20"
            />
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center animate-slide-up">
          <p className="text-base sm:text-lg font-medium mb-4 sm:mb-6 dark:text-white">
            Conozca más sobre nuestros servicios y cómo podemos ayudarle a mejorar su logística
          </p>
          <a
            href="#contacto-form"
            className="inline-block bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white font-medium py-3 px-6 sm:px-8 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
          >
            Contáctenos
          </a>
        </div>
      </div>
    </section>
  )
}
