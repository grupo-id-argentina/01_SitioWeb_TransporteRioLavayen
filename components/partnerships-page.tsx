"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Send } from "lucide-react"

export function PartnershipsPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Crear FormData para enviar a la Server Action
      const formDataToSend = new FormData()
      formDataToSend.append("companyName", formData.companyName)
      formDataToSend.append("contactName", formData.contactName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("businessType", formData.businessType)
      formDataToSend.append("message", formData.message)

      // Importar y usar la Server Action
      const { submitConvenioForm } = await import("@/app/actions/contact-actions")
      const result = await submitConvenioForm(formDataToSend)

      if (result.success) {
        setSubmitted(true)
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          businessType: "",
          message: "",
        })
      } else {
        setError(result.message || "Error al enviar la solicitud")
      }
    } catch (err) {
      setError("Ha ocurrido un error al enviar su solicitud. Por favor, inténtelo más tarde.")
      console.error("Error en formulario de convenios:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    "Tarifas preferenciales y personalizadas según volumen",
    "Gestión prioritaria de envíos",
    "Asesoramiento logístico especializado",
    "Sistema de facturación centralizado",
    "Seguimiento en tiempo real de todos los envíos",
    "Descuentos por volumen progresivos",
    "Atención personalizada 24/7",
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-red-500 to-red-600 py-8 px-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Programa de Alianzas Estratégicas</h2>
          <p>Únase a nuestra red de partners y obtenga beneficios exclusivos para su empresa</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Beneficios del Programa</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Tipos de Alianzas</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2">Convenios Corporativos</h4>
                <p className="text-gray-600 mb-3">
                  Dirigido a empresas con necesidades regulares de transporte de mercancías.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Tarifas fijas garantizadas</li>
                  <li>• Facturación mensual</li>
                  <li>• Gestor de cuenta dedicado</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2">Alianzas Estratégicas</h4>
                <p className="text-gray-600 mb-3">
                  Para operadores logísticos y empresas de e-commerce que requieren soluciones integradas.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Integración de sistemas</li>
                  <li>• Logística personalizada</li>
                  <li>• Operaciones conjuntas</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Solicite un Convenio</h3>
            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>
                  ¡Solicitud enviada con éxito! Nuestro equipo comercial se pondrá en contacto con usted a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="companyName" className="block text-gray-700 mb-2">
                    Nombre de la empresa *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contactName" className="block text-gray-700 mb-2">
                    Nombre del contacto *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Teléfono/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="businessType" className="block text-gray-700 mb-2">
                    Tipo de negocio *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="comercio">Comercio</option>
                    <option value="industria">Industria</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="servicios">Servicios</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Detalles adicionales *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    placeholder="Cuéntenos sobre sus necesidades de logística y volumen estimado mensual"
                  ></textarea>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 md:col-span-2">
                    <p>{error}</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        <span>Enviar solicitud</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
