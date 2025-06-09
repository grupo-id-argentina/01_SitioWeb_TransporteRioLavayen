"use client"

import type React from "react"

import { useState } from "react"
import { Truck, Package, Warehouse, ShieldCheck, Boxes, Forklift, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Service = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  detailedDescription: string
  features: string[]
  image: string
}

export function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const services: Service[] = [
    {
      id: 1,
      title: "Transporte de Carga General",
      description: "Servicio de transporte para todo tipo de mercancías a nivel nacional.",
      icon: <Truck className="h-12 w-12" />,
      color: "from-primary-500 to-accent-400",
      detailedDescription:
        "Nuestro servicio de transporte de carga general está diseñado para satisfacer las necesidades logísticas de empresas de todos los tamaños. Contamos con una flota moderna y diversa que nos permite transportar todo tipo de mercancías con seguridad y eficiencia.",
      features: [
        "Cobertura nacional con rutas optimizadas",
        "Seguimiento en tiempo real de la carga",
        "Vehículos adaptados según el tipo de mercancía",
        "Documentación y trámites incluidos",
        "Seguro de carga incluido",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Logística Integral",
      description: "Soluciones completas de logística adaptadas a sus necesidades específicas.",
      icon: <Package className="h-12 w-12" />,
      color: "from-blue-500 to-purple-500",
      detailedDescription:
        "Ofrecemos soluciones logísticas integrales que abarcan toda la cadena de suministro. Desde la planificación hasta la entrega final, nos encargamos de optimizar cada etapa del proceso para garantizar la máxima eficiencia y reducción de costos.",
      features: [
        "Planificación estratégica de rutas",
        "Gestión de inventario y almacenamiento",
        "Distribución y entrega final",
        "Logística inversa",
        "Informes y análisis de rendimiento",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Almacenamiento y Distribución",
      description: "Espacios de almacenamiento seguros y servicios de distribución eficientes.",
      icon: <Warehouse className="h-12 w-12" />,
      color: "from-amber-500 to-orange-500",
      detailedDescription:
        "Disponemos de instalaciones de almacenamiento estratégicamente ubicadas en todo el país, equipadas con la última tecnología en seguridad y control de inventario. Complementamos este servicio con una red de distribución eficiente que garantiza entregas puntuales.",
      features: [
        "Almacenes con control de temperatura",
        "Sistemas avanzados de seguridad",
        "Gestión de inventario en tiempo real",
        "Preparación de pedidos (picking)",
        "Distribución urbana y nacional",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      title: "Transporte de Cargas Especiales",
      description: "Servicio especializado para mercancías que requieren condiciones particulares.",
      icon: <ShieldCheck className="h-12 w-12" />,
      color: "from-green-500 to-teal-500",
      detailedDescription:
        "Contamos con equipamiento y personal especializado para el transporte de cargas que requieren condiciones especiales, como productos perecederos, materiales peligrosos, o mercancías de alto valor que necesitan medidas de seguridad adicionales.",
      features: [
        "Vehículos con control de temperatura",
        "Transporte de materiales peligrosos",
        "Cargas sobredimensionadas",
        "Mercancías de alto valor",
        "Personal capacitado en manejo de cargas especiales",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 5,
      title: "Mudanzas Corporativas",
      description: "Servicio integral de mudanzas para empresas y oficinas.",
      icon: <Boxes className="h-12 w-12" />,
      color: "from-pink-500 to-rose-500",
      detailedDescription:
        "Ofrecemos un servicio completo de mudanzas corporativas que minimiza el tiempo de inactividad de su empresa. Nos encargamos de todo el proceso, desde el embalaje hasta la instalación en la nueva ubicación, garantizando la seguridad de todos sus activos.",
      features: [
        "Planificación detallada del proceso",
        "Embalaje profesional de equipos y mobiliario",
        "Desmontaje y montaje de mobiliario",
        "Transporte seguro de documentación sensible",
        "Coordinación logística completa",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 6,
      title: "Servicios de Cross-Docking",
      description: "Optimización de la cadena de suministro mediante cross-docking.",
      icon: <Forklift className="h-12 w-12" />,
      color: "from-cyan-500 to-blue-500",
      detailedDescription:
        "Nuestro servicio de cross-docking permite reducir los tiempos de almacenamiento y los costos asociados. Recibimos la mercancía, la clasificamos y la enviamos directamente a su destino final sin necesidad de almacenamiento prolongado, optimizando así toda la cadena logística.",
      features: [
        "Reducción de costos de almacenamiento",
        "Disminución de tiempos de entrega",
        "Clasificación y consolidación de cargas",
        "Optimización de rutas de distribución",
        "Trazabilidad completa del proceso",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="relative">
      {/* Fondo interactivo */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-secondary-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer bg-white dark:bg-secondary-800"
            onClick={() => setSelectedService(service)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
            ></div>

            <div className="relative p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="opacity-90">{service.description}</p>
              </div>

              <button className="mt-6 flex items-center text-sm font-medium group-hover:underline">
                Ver detalles
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de servicio */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className={`bg-gradient-to-r ${selectedService.color} p-6 rounded-t-2xl relative`}>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all duration-200 hover:rotate-90"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 flex items-center justify-center backdrop-blur-sm">
                  {selectedService.icon}
                </div>
                <h2 className="text-2xl font-bold text-white ml-4">{selectedService.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedService.detailedDescription}</p>

                <h3 className="text-lg font-semibold mb-3 dark:text-white">Características del servicio:</h3>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div
                        className={`rounded-full p-1 bg-gradient-to-r ${selectedService.color} text-white mr-2 flex-shrink-0 mt-0.5`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  Cerrar
                </button>
                <Link
                  href="/contacto"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-400 hover:from-primary-600 hover:to-accent-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Solicitar información
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
