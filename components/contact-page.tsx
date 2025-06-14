"use client"

import type React from "react"
import { useState } from "react"
import { Send, HelpCircle, X, CheckCircle, Building, Phone, Mail, MapPin } from "lucide-react"
import { submitContactForm, submitConvenioForm } from "@/app/actions/contact-actions"

export function ContactPage() {
  // Estado para el formulario de contacto general
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "",
  })

  // Estados de envío
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Estado para el modal de convenio
  const [showConvenioModal, setShowConvenioModal] = useState(false)

  // Manejar cambios en el formulario principal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Enviar formulario principal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validar campos antes de enviar
      if (
        !formData.name?.trim() ||
        !formData.email?.trim() ||
        !formData.phone?.trim() ||
        !formData.subject?.trim() ||
        !formData.message?.trim()
      ) {
        setError("Por favor, completa todos los campos requeridos.")
        setIsSubmitting(false)
        return
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        setError("Por favor, ingresa un email válido.")
        setIsSubmitting(false)
        return
      }

      // Validar teléfono
      const cleanPhone = formData.phone.replace(/\D/g, "")
      if (cleanPhone.length < 10) {
        setError("Por favor, ingresa un número de teléfono válido de al menos 10 dígitos.")
        setIsSubmitting(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name.trim())
      formDataToSend.append("email", formData.email.trim())
      formDataToSend.append("phone", cleanPhone)
      formDataToSend.append("subject", formData.subject.trim())
      formDataToSend.append("message", formData.message.trim())
      formDataToSend.append("company", formData.company.trim())

      const result = await submitContactForm(formDataToSend)

      if (result.success) {
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          company: "",
        })

        // Disparar widget de feedback después de envío exitoso
        setTimeout(() => {
          const event = new CustomEvent("showFeedbackWidget", {
            detail: { trigger: "contact_form_submitted" },
          })
          window.dispatchEvent(event)
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Ha ocurrido un error al enviar su mensaje. Por favor, inténtelo más tarde.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Preguntas frecuentes
  const faqs = [
    {
      question: "¿Cuáles son las áreas de cobertura?",
      answer:
        "Brindamos servicio en el territorio argentino, nuestra casa central se encuentra en la ciudad de San Pedro de Jujuy y contamos con anexos en Oran, La Quiaca, Santa Fé, Cordoba y CABA.",
    },
    {
      question: "¿Cómo puedo hacer el seguimiento de mi envío?",
      answer:
        "Puede realizar el seguimiento a través del telefóno 3888 123456 línea directa con nuestro equipo de logística, tienes que tener a mano el número de remito.",
    },
    {
      question: "¿Qué documentación necesito para enviar un paquete?",
      answer:
        "Para envíos estándar necesitará su DNI y los datos completos del destinatario. Para mercancías específicas pueden requerirse documentos adicionales según las normativas vigentes.",
    },
    {
      question: "¿Ofrecen seguro para los envíos?",
      answer:
        "Sí, ofrecemos diferentes opciones de seguro para su mercancía. El seguro básico está incluido en todos los envíos y puede contratar coberturas adicionales según el valor declarado.",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Fondo interactivo */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-secondary-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-accent-400 py-6 px-6 text-white">
              <h2 className="text-2xl font-bold">Formulario de Contacto</h2>
              <p>Complete el formulario para cualquier consulta o solicitud</p>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 border border-green-400 text-white px-4 py-3 rounded-lg mb-4 shadow-lg animate-fade-in">
                  <p>¡Mensaje enviado con éxito! Nos pondremos en contacto con usted a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono/WhatsApp *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-secondary-600 text-gray-500 dark:text-gray-300 rounded-l-lg font-medium">
                        +549
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                          setFormData((prev) => ({ ...prev, phone: value }))
                        }}
                        placeholder="1123456789"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ingrese 10 dígitos sin el 0 ni el 15 (ej: 1123456789)
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="company" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Empresa (opcional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                      required
                    >
                      <option value="">Seleccione un asunto</option>
                      <option value="cotizacion">Solicitar cotización</option>
                      <option value="seguimiento">Seguimiento de envío</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="informacion">Información general</option>
                      <option value="convenio">Solicitar convenio empresarial</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 resize-none"
                      required
                    ></textarea>
                  </div>

                  {error && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 border border-red-400 text-white px-4 py-3 rounded-lg mb-4 shadow-lg">
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-400 hover:from-primary-600 hover:to-accent-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Información de contacto */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-6 text-white">
              <h2 className="text-2xl font-bold">Información de Contacto</h2>
              <p>Múltiples formas de comunicarte con nosotros</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full text-white shadow-md mr-3 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Teléfonos</h3>
                    <p className="text-gray-600 dark:text-gray-300">3888 44-6213 (Administración)</p>
                    <p className="text-gray-600 dark:text-gray-300">3888 51-6860 (Logística)</p>
                    <p className="text-gray-600 dark:text-gray-300">3888 43-5275 (Comercial)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full text-white shadow-md mr-3 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Emails</h3>
                    <p className="text-gray-600 dark:text-gray-300">tteriolavayensanpedro@gmail.com</p>
                    <p className="text-gray-600 dark:text-gray-300">consulta.tteriolavayen@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full text-white shadow-md mr-3 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ubicación</h3>
                    <p className="text-gray-600 dark:text-gray-300">San Pedro de Jujuy, Argentina</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Con anexos en Orán, La Quiaca, Santa Fe, Córdoba y CABA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-6 px-6 text-white">
              <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
              <p>Respuestas a las consultas más comunes</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="group">
                    <h3 className="font-semibold text-lg mb-2 flex items-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 dark:text-white">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full text-white shadow-md mr-3 flex-shrink-0 group-hover:shadow-lg transition-all duration-300">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 pl-12">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de convenios empresariales */}
      <div className="mt-10 bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 py-6 px-6 text-white">
          <h2 className="text-2xl font-bold">Convenios Empresariales</h2>
          <p>Soluciones logísticas personalizadas para tu empresa</p>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Tu empresa necesita servicios de logística regulares? Ofrecemos convenios especiales con tarifas
            preferenciales y servicios personalizados.
          </p>
          <button
            onClick={() => setShowConvenioModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Building className="mr-2 h-5 w-5" />
            <span>Solicitar Convenio Empresarial</span>
          </button>
        </div>
      </div>

      {/* Modal de Convenio */}
      {showConvenioModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="bg-gradient-to-r from-red-500 to-red-600 py-4 px-6 text-white flex justify-between items-center rounded-t-2xl">
              <h3 className="text-xl font-bold">Solicitud de Convenio Empresarial</h3>
              <button
                onClick={() => setShowConvenioModal(false)}
                className="text-white hover:text-gray-200 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 hover:rotate-90"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <ConvenioForm onClose={() => setShowConvenioModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para el formulario de convenio
function ConvenioForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    monthlyVolume: "",
    services: [] as string[],
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      services: checked ? [...prev.services, value] : prev.services.filter((service) => service !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("companyName", formData.companyName)
      formDataToSend.append("contactName", formData.contactName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("businessType", formData.businessType)
      formDataToSend.append("monthlyVolume", formData.monthlyVolume)
      formDataToSend.append("services", JSON.stringify(formData.services))
      formDataToSend.append("message", formData.message)

      const result = await submitConvenioForm(formDataToSend)

      if (result.success) {
        setSubmitted(true)

        // Disparar widget de feedback después de envío exitoso
        setTimeout(() => {
          const event = new CustomEvent("showFeedbackWidget", {
            detail: { trigger: "convenio_form_submitted" },
          })
          window.dispatchEvent(event)
          onClose()
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Ha ocurrido un error al enviar su solicitud. Por favor, inténtelo más tarde.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">¡Solicitud enviada exitosamente!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Gracias por su interés en nuestros convenios empresariales. Nuestro equipo comercial se pondrá en contacto con
          usted dentro de las próximas 24 horas para discutir las mejores opciones para su empresa.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            <strong>Próximos pasos:</strong> Recibirá un email de confirmación y nuestro equipo preparará una propuesta
            personalizada basada en sus necesidades.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la empresa *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de contacto *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email corporativo *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Teléfono de contacto
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de empresa
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
          >
            <option value="">Seleccione una opción</option>
            <option value="pequeña">Pequeña empresa (1-50 empleados)</option>
            <option value="mediana">Mediana empresa (51-250 empleados)</option>
            <option value="grande">Gran empresa (251+ empleados)</option>
            <option value="multinacional">Multinacional</option>
            <option value="startup">Startup</option>
            <option value="ecommerce">E-commerce</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Volumen mensual estimado
          </label>
          <select
            id="monthlyVolume"
            name="monthlyVolume"
            value={formData.monthlyVolume}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white"
          >
            <option value="">Seleccione una opción</option>
            <option value="1-10">1-10 envíos/mes</option>
            <option value="11-50">11-50 envíos/mes</option>
            <option value="51-100">51-100 envíos/mes</option>
            <option value="101-500">101-500 envíos/mes</option>
            <option value="500+">Más de 500 envíos/mes</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Servicios de interés (seleccione todos los que apliquen)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "logistica", label: "Logística integral" },
            { id: "transporte", label: "Transporte nacional" },
            { id: "almacenamiento", label: "Almacenamiento y depósito" },
            { id: "distribucion", label: "Distribución last-mile" },
            { id: "ecommerce", label: "Logística e-commerce" },
            { id: "express", label: "Envíos express" },
            { id: "carga", label: "Transporte de carga pesada" },
            { id: "refrigerado", label: "Transporte refrigerado" },
          ].map((service) => (
            <div key={service.id} className="flex items-center">
              <input
                type="checkbox"
                id={service.id}
                name="services"
                value={service.id}
                checked={formData.services.includes(service.id)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor={service.id} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                {service.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cuéntenos sobre sus necesidades logísticas *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white resize-none"
          required
          placeholder="Describa sus necesidades actuales de logística, volúmenes, destinos frecuentes, y cualquier requerimiento especial..."
        ></textarea>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              <span>Enviando...</span>
            </div>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              <span>Enviar Solicitud</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
